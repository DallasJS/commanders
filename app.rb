require "sinatra"
require "mongo"
require "json"

get "/" do
	File.read(File.join("public", "index.html"))
end

before "/api/*" do
	content_type :json

	db_url = URI.parse(ENV["MONGOHQ_URL"])
	db_name = db_url.path.gsub(/^\//, "")
	db = Mongo::Connection.new(db_url.host, db_url.port).db(db_name)
	db.authenticate(db_url.user, db_url.password)

	@commanders = db.collection("commanders")
end

def replaceProp(hash, origProp, newProp)
	hash[newProp] = hash[origProp].to_s
	hash.delete(origProp)
end

get "/api/commanders" do
	commanders = @commanders.find().to_a
	commanders.each do |c|
		# c["votes"] = c["upvotes"].to_i - c["downvotes"].to_i
		replaceProp(c, "_id", "id")
	end

	commanders.sort! { |a,b| b["votes"] <=> a["votes"] }
	commanders.to_json
end

get "/api/commanders/:id" do
	commander = @commanders.find_one(:_id => BSON::ObjectId(params[:id]))

	if commander.count > 0
		replaceProp(commander, "_id", "id")
	end

	commander.to_json
end

post "/api/commanders" do
	body = JSON.parse(request.body.read)
	id = @commanders.insert(body).to_s

	replaceProp(body, "_id", "id")
	body.to_json
end

put "/api/commanders/:id" do
	id = BSON::ObjectId(params[:id])
	body = JSON.parse request.body.read

	commander = @commanders.find_one(:_id => id)

	commander["upvotes"] = body["upvotes"]
	commander["downvotes"] = body["downvotes"]

	@commanders.update({ :_id => id }, commander);

	replaceProp(commander, "_id", "id")
	commander.to_json
end

delete "/api/commanders/:id" do
	@commanders.remove(:_id => BSON::ObjectId(params[:id]))
end
