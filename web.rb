require 'sinatra'
require 'rubygems' 

get '/' do
  erb :timeline
end

get '/viz' do
  erb :viz
end
