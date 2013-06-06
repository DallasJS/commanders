// (function() {

// 	var store = can.fixture.store(10, function(i) {

// 		return {
// 			id: i,
// 			upvotes: 10,
// 			downvotes: 2,
// 			name: 'Cpt ' + Faker.Name.findName(),
// 			ship: 'USS ' + Faker.Internet.domainWord(),
// 			photo: 'http://lorempixel.com/120/150'
// 		}

// 	});

// 	can.fixture('GET /api/commanders', store.findAll);
// 	can.fixture('GET /api/commanders/{id}', store.findOne);
// 	can.fixture('POST /api/commanders', store.create);
// 	can.fixture('PUT /api/commanders/{id}', store.update);
// 	can.fixture('DELETE /api/commanders/{id}', store.destroy);

// })();