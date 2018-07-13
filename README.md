Utility library to help test the json schemas created by
[sequelize-to-json-schema](https://github.com/raisely/sequelize-to-json-schema)

# Install

```
npm install --save-dev sequelize-to-json-schema-tester
```

# Usage

```js
const TestHelper = require('sequelize-to-json-schema-tester');
const SchemaFactory = require('sequelize-to-json-schema');

const Models = // your sequelize models;
const associations = { users: { profile: 'ref', friends: 'ref', address: 'inline' } };

const virtualProperties = {
	users: {
		followers: { type: 'INTEGER' },
	},
};

const factory = new SchemaFactory({ associations, virtualProperties, hrefBase: '//myurl' });

const helper = TestHelper.getTestHelper(Models.subscriptions, factory.options);

describe('User schema endpoint', () => {
  let response;
  before(() => {
    response = get('/myapi/schema/users.json');
  });
  it('describes all properties', () => {
    const allProperties = [
      'name', // An actual attribute of the model
      'followers', // A virtual attribute not on the model but calculated
    ];

    // Assert that the schema contains all expected attributes
    helper.assertProperties(response, allProperties);
  });
  it('describes all associations', () => {
    // Assert that all associations are present in the schema
    helper.assertAssociations(response, ['profile', 'friends', 'address']);    
  });
  it('fully describes all properties and associations', () => {
    // Will recursively look through all inline associations
    helper.assertAllPropertiesDescribed(response);    
  });
	it('looks like an example json', () => {
		const exampleUser = {
			name: 'Gerald',
			followers: 3,
		};

		helper.assertAllExampleFields(response, exampleUser);		
	})
});
```

## assertProperties(response, allProperties)

Asserts that the schema contains all of the properties in the array of
properties given.
It ignores any properties present in the schema that are not in the array
of property names to check

## assertAllPropertiesDescribed(response, [fields])

This checks that all the properties in the response are fully described.
By default, this means checking that each property includes
id, description, title, type and examples
(It will still pass if any of these are empty strings/arrays)

For properties that are objects or arrays, it will check the nested
elements within them

## assertAllExampleFields(response, exampleObject)

This allows for a quick check by passing an example object and verifying that
the schema describes that object.

## assertAssociations(response, associations)

Associations is an array of strings being the property names of expected associations
Checks that those associations are described and that they are appropriately described
by either $ref or described inline depending on the settings passed to the SchemaFactory
