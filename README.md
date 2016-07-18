# fowl
A truly lightweight Javascript Entity Component System
## Usage
### Components
Components are contructors that create objects of related data. The method `fowl.registerComponents(...)` has to be called once before instantiating components.
```javascript
// A constructor for the Position component
var Position = function(x, y) {
	this.x = x;
	this.y = y;
};
fowl.registerComponents(Position); // Register the Position component for use with fowl
```
### Entities
#### Creating entities
An `EntityManager` is necessary for dealing with entities. `EntityManager.createEntity()` will create an entity with zero components.
```javascript
var em = new fowl.EntityManager();
var entity = em.createEntity();
```
#### Assigning components to entities
To add a component to an entity call `EntityManager.addComponent(entity, component)` with the entity and the component as arguments. Likewise does `EntityManager.removeComponent(entity, component)` remove a component.
```javascript
em.addComponent(entity, new Position(10, 0));
```
#### Querying entities and their components
To iterate over the entities with e.g. the `Position` component you must first create a mask for the component types with `EntityManager.getMask(componentTypes)`. Attn. You should allocate your masks at initialization only since they are costly to create.
```javascript
var movementSystemMask = em.getMask([Position]);
```
Then, iterate over all entities and check whether they match the mask:
```javascript
for (var entity = 0, length = em.count; entity < length; ++entity) {
	if (em.matches(entity, movementSystemMask)) {
		// Do stuff with `entity`
	}
}
```
To retrieve a component associated with an entity use `EntityManager.getComponent(entity, component)`.
```javascript
var position = em.getComponent(entity, Position);
```
#### Removing all entities
`EntityManager.clear()` removes all entities in play.
