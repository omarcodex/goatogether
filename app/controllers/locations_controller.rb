class LocationsController < ApplicationController
  def index
    @journey = Journey.new
    @allresults = []
    if current_user
      @pending_invitations = Invite.where("guest_id = ? AND response IS ?", current_user.id, nil).order("created_at DESC")

      if request.location
        @current_location = request.location # <-- Use gem in deploy.
        p @current_location.inspect
        lat =  @current_location.latitude
        long = @current_location.longitude
      else
        lat = "32.99" #<-- Use test for localhost environment.
        long = "-117.0"
      end
      radius = "20"
      # @allresults << twitter_search(current_user.twitter, "#coffee", lat, long, radius) #
      respond_to do |format|
        format.html
        format.json { render json: @allresults }
      end
    else
      if request.xhr?
        render 'users/login', layout: false
      end
    end
  end

  def edit

  end

  def show

  end

  def explore

  end

  private

  def current_user
    @current_user ||= User.find(session[:user_id]) if session[:user_id]
  end

 def twitter_search(twitter_client, search_term, lat, long, radius, max_id=nil, results=[], pins=3)
    search_term = search_term.to_s
    if results.length >= pins
      results.slice!(pins..-1)
      return results
    else

      results2 =  current_user.twitter.search(search_term, geocode:"#{lat},#{long},#{radius}mi", max_id: max_id).take(5).to_a
      results = results.concat(results2)
      max_id = results.last.id

      results.select!{|tweet| tweet.geo? }
      twitter_search(twitter_client, search_term, lat, long, radius, max_id, results)
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

end
