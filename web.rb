require 'sinatra'
require 'rubygems' 

get '/' do
  erb :main
end

get '/time' do
  erb :timeline
end

get '/viz' do
  erb :graph
  # erb :viz
end

get '/viz_d3' do
  erb :viz_d3
end
