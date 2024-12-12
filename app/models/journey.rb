class Journey < ApplicationRecord
  belongs_to :user
  has_many :invites
  has_many :participants, source: :User

  scope :upcoming, -> { where('start_time > ?', Time.zone.now) }
  scope :current, -> { where('end_time > ? AND start_time < ?', Time.zone.now, Time.zone.now) }
  scope :previous, -> { where('end_time < ?', Time.zone.now) }
  scope :by, -> (user) { where(user_id: user.id) }
end
