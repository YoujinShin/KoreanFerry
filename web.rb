require 'sinatra'
require 'rubygems' 

get '/' do
  erb :main
end

get '/time' do
  erb :timeline
end

get '/viz' do
  erb :viz
end
