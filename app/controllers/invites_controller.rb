class InvitesController < ApplicationController

  def index
    if current_user
      @pending_invitations = Invite.where("guest_id = ? AND response IS ?", current_user.id, nil).order("created_at DESC")
    end
    render :index
  end

    def new
  end

  def create
  end

  def show
    @invite = Invite.find_by_id(params[:id])
    @journey = Journey.new
    if current_user
      @pending_invitations = Invite.where("guest_id = ? AND response IS ?", current_user.id, nil).order("created_at DESC")
    else
      redirect_to '/'
    end
    render :show
  end

  def edit
    @invite = Invite.find_by_id(params[:id])
    puts "Here's your response" + params[:response]
  end

  def update
    @journey = Journey.new
    @invite = Invite.find_by_id(params[:id])
    @invite.update_attributes(response: params[:response])
    @invite.save
    hostresult = Journey.where("user_id = ?", current_user.id).joins(:invites).where("guest_id != ?", current_user.id).to_a
    guestresult = Journey.where("user_id != ?", current_user.id).joins(:invites).where("guest_id = ?", current_user.id).to_a
    @all_my_journeys = hostresult + guestresult
    @upcoming_journeys = @all_my_journeys.select {|journey| journey.start_time > Time.zone.now}
     @current_journeys = @all_my_journeys.select {|journey| journey.start_time <= Time.zone.now && journey.end_time >= Time.zone.now}
    @previous_journeys = @all_my_journeys.select {|journey| journey.end_time < Time.zone.now}
    @pending_invitations = Invite.where("guest_id = ? AND response IS ?", current_user.id, nil).order("created_at DESC")

    if request.xhr?
        render :'/journeys/index', layout: false
    else
      "try again"
    end
  end

  def destroy
  end

  private

    def current_user
      @current_user ||= User.find(session[:user_id]) if session[:user_id]
    end

end
