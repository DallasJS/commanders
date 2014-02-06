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
		replaceProp(c, "_id", "id")
	end

	commanders.to_json
end

put "/api/commanders/:id" do
	id = BSON::ObjectId(params[:id])
	body = params

	commander = @commanders.find_one(:_id => id)

	commander["upvotes"] = body["upvotes"]
	commander["downvotes"] = body["downvotes"]

	@commanders.update({ :_id => id }, commander);

	replaceProp(commander, "_id", "id")
	commander.to_json
end