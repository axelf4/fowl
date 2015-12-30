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
To iterate over the entities with, e.g., the `Position` component, use `EntityManager.each(callback, ...)`. To iterate over all entities you simply don't pass any additional arguments. `callback` is a function callback that is called for each entity.
```javascript
em.each(function(entity) {
	console.log(entity);
}, Position);
```
To retrieve a component associated with an entity use `EntityManager.getComponent(entity, component)`.
```javascript
var position = em.getComponent(entity, Position);
```
#### Removing all entities
`EntityManager.clear()` simply removes all components from all entities in play, with the effect of removing all entities.
