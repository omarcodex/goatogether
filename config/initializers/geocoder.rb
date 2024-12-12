Geocoder.configure(
  # geocoding service (see below for supported options):
  # :lookup => :google,
  # # IP address geocoding service (see below for supported options):
  :ip_lookup => :ipinfo_io,
  # :use_https => true,
  #
  #  # to use an API key:
  # :api_key => ENV["GOOGLE_API_KEY"],

   # geocoding service request timeout, in seconds (default 3):
   :timeout => 10 # CHECK against avg time for API to return results.
)
