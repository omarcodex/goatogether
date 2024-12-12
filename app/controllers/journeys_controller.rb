class JourneysController < ApplicationController
  def index
    @journey = Journey.new
    @upcoming_journeys = Journey.by(current_user).upcoming
    @current_journeys = Journey.by(current_user).current
    @previous_journeys = Journey.by(current_user).previous
    @accepted_invitations = Invite.by(current_user).positive
    @pending_invitations = Invite.where("guest_id = ? AND response IS ?", current_user.id, nil).order("created_at DESC")
    if request.xhr?
      render :index, layout: false
    else
      render :'index'
    end
  end

  def new
    @journey = Journey.new
    respond_to do |format|
      format.html { render :_new }
      format.json
    end
  end

  def search
    search = params[:search]
    radius =  params[:rangeInput]
    @current_location = request.location
    lat =  params[:lat] || @current_location.latitude
    long = params[:long] || @current_location.longitude
    p "Searching in location: #{lat}, #{long}" # <-- For debugging

    @users = []
    @users = twitter_search(current_user.twitter, search, lat, long, radius)
    if request.xhr?
      render :json => @users
    else
      render :_search
    end
  end

  def create
    @journey = Journey.new(journey_params)
    @journey.user_id = current_user.id

    if @journey.save
      friends.each do |friend|
        uid = current_user.twitter.user("#{friend}").id
        @guest = User.find_or_initialize_by(uid: uid)
        @guest.provider ||= "twitter"
        @guest.name ||= "guest"
        @guest.nickname ||= 'guest'
        @guest.save
        @invite = Invite.create(journey_id: @journey.id, guest_id: @guest.id)

        # Method for sending notification message via twitter:
        @guest_handle = current_user.twitter.user(@guest.uid.to_i)
        current_user.twitter.update("@#{@guest_handle.screen_name}: @#{@invite.journey.user.nickname} has invited you for a journey! Check it out at https://goatogether.herokuapp.com ! #goatogether")
      end
      if request.xhr? # use responders instead of xhr? method
        @upcoming_journeys = Journey.by(current_user).upcoming
        @current_journeys = Journey.by(current_user).current
        @previous_journeys = Journey.by(current_user).previous
        @accepted_invitations = Invite.by(current_user).positive
        @pending_invitations = Invite.where("guest_id = ? AND response IS ?", current_user.id, nil).order("created_at DESC")
        @errors = @journey.errors.full_messages
        render :index, layout: false
      end
    else
      @errors = @journey.errors.full_messages
    end
  end

  def show
    @journey = Journey.find(params[:journey_id])
    @accepted_invitations = Invite.by(current_user).positive
    @pending_invitations = Invite.where("guest_id = ? AND response IS ?", current_user.id, nil).order("created_at DESC")
    @result = current_user.twitter.search("from:#{@journey.user.nickname} #{@journey.hashtag}").to_a

    if @journey.invites.first
      @user = current_user.twitter.user(@journey.invites.first.guest.uid.to_i).screen_name
      @guest_result = current_user.twitter.search("from:#{@user} #{@journey.hashtag}").to_a
      # binding.pry
      @combined_results = @result.concat(@guest_result)
    else
      @combined_results = @result
    end

    @combined_results.select! do |result|
      result.created_at >= @journey.start_time && result.created_at <= @journey.end_time
    end
    @combined_results = @combined_results.to_json

    if request.xhr? # user responders instead of xhr? method
      render :show, layout: false
    end
  end


  def random
      journey_count = get_journeys_user_is_not_apart_of.count
      if journey_count == 0
        render_404
      else
        @journey = get_journeys_user_is_not_apart_of[rand(0..(journey_count-1))]
        @result = current_user.twitter.search("#{@journey.user.nickname} #{@journey.hashtag}").to_a
        get_tweets_from_within_timeline(@result)
        if request.xhr?
          render :show, layout: false
        end
      end
  end

  def edit
    @journey = Journey.find_by_id(params[:id])
  end

private

 def not_a_guest(journey, current_user)
  journey.invites.each do |invite|
    if invite.guest_id == current_user.id
      return false
    end
  end
  return true
 end

 def render_404
  respond_to do |format|
    format.html { render :file => "#{Rails.root}/public/404", :layout => false, :status => :not_found }
    format.json { render :file => "#{Rails.root}/public/404", :layout => false, :status => :not_found }
    format.xml  { head :not_found }
    format.any  { head :not_found }
    end
  end

  # takes the friends param and breaks it up into individual people
  def friends
    params[:friends][:guest_id].split(", ")
  end

  def get_journeys_user_is_not_apart_of
    journeys = Journey.where('user_id != ?', current_user.id)
    random_journeys = []
    journeys.each do |journey|
      if journey.invites.empty?
        random_journeys << journey
      else
        journey.invites.each do |invite|
          if invite.guest_id != current_user.id
            random_journeys << journey
          end
        end
      end
    end
    return random_journeys
  end

  def get_tweets_from_within_timeline(array)
    array.select! do |result|
      result.created_at >= @journey.start_time && result.created_at <= @journey.end_time
    end
  end


  def twitter_search(twitter_client, search_term, lat, long, radius, max_id=nil, results=[], pins=25)
    search_term = search_term.to_s

    if results.length >= pins
      results.slice!(pins..-1)
      return results
    else
      puts "#{radius.to_i}"
      results2 =  current_user.twitter.search(search_term, geocode:"#{lat},#{long},#{radius}mi", max_id: max_id).take(15).to_a
      results = results.concat(results2)
      max_id = results.last.id

      results.select!{|tweet| tweet.geo? }
      twitter_search(twitter_client,search_term, lat, long, radius, max_id, results)
    end
  end

   def range (min, max)
    rand * (max-min) + min
   end

   def create_random_tweet
    {
    'coordinates': {'coordinates': [range(-80,-124),range(18,49)]},
    'text': Faker::Hipster.sentences(1).first,
    'name': Faker::Name.name
   }
   end

  def journey_params
    params.require(:journey).permit(:name, :hashtag, :start_time, :end_time, :user_id)
  end

  def invite_params
    params.require(:invite).permit(:guest_id)
  end

  def current_user
    @current_user ||= User.find(session[:user_id]) if session[:user_id]
  end

  def find_journey
    Journey.find_by(id: params[:id])
  end
end
