var fowl = (function() { "use strict";
	/**
	 * An entity manager.
	 * @constructor
	 */
	var EntityManager = function() {
		var size = 1024;
		/**
		 * Array of bitflags for each entity's component.
		 * @type {BitSet[]}
		 */
		this.entityMask = new Array(size);
		/**
		 * Pool of availible entity identifiers.
		 * @type {number[]}
		 */
		this.pool = [];
		/**
		 * The highest identifier that has been given to an entity.
		 * @type {number}
		 */
		this.count = 0;
	};
	/**
	 * Create a new entity.
	 * @return {number} The identifier of the new entity.
	 */
	EntityManager.prototype.createEntity = function() {
		var entity = this.pool.length > 0 ? this.pool.pop() : this.count++;
		this.entityMask[entity] = new BitSet();
		return entity;
	};
	/**
	 * Remove the entity.
	 * @param {number} entity - The identifier of the entity to remove.
	 */
	EntityManager.prototype.removeEntity = function(entity) {
		this.entityMask[entity].clear();
		this.pool.push(entity);
	};
	/**
	 * Assign a component to an entity.
	 * @param {number} entity - The entity.
	 * @param {?Object} component - The component.
	 * @return {?Object} The component.
	 */
	EntityManager.prototype.addComponent = function(entity, component) {
		var componentType = component.constructor;
		this.entityMask[entity].set(componentType.componentId);
		return componentType.components[entity] = component;
	};
	/**
	 * Remove a component from an entity.
	 * @param {number} entity - The entity.
	 * @param {!Object} - The component.
	 */
	EntityManager.prototype.removeComponent = function(entity, component) {
		this.entityMask[entity].set(component.componentId, false);
	};
	/**
	 * Returns whether or not an entity has a specific component.
	 * @param {number} entity - The entity.
	 * @param {!Object} component - The component.
	 * @return {boolean} Whether the entity has the component.
	 */
	EntityManager.prototype.hasComponent = function(entity, component) {
		return this.entityMask[entity].get(component.componentId);
	};
	/**
	 * Retrieve a component from an entity.
	 * @param {number} entity - The entity.
	 * @param {!Object} component - The component.
	 * @return {?Object} The component from the entity.
	 */
	EntityManager.prototype.getComponent = function(entity, component) {
		return component.components[entity];
	};
	/**
	 * Remove all entities.
	 */
	EntityManager.prototype.clear = function() {
		for (var i = 0, length = this.count; i < length; i++) {
			this.entityMask[i].clear();
		}
	};
	/**
	 * Applies the callback to each entity with the specified components.
	 * @param {function(number)} callback - The callback.
	 * @param {...Object} Components that the entities mush have.
	 */
	EntityManager.prototype.each = function(callback) {
		var mask = new BitSet();
		for (var i = 1; i < arguments.length; ++i) {
			mask.set(arguments[i].componentId, true);
		}
		for (var i = 0, length = this.count; i < length; ++i) {
			if (mask.contains(this.entityMask[i])) callback(i); // Call callback with the entity
		}
	};
	EntityManager.prototype.matches = function(entity, mask) {
		return mask.contains(this.entityMask[entity]);
	};
	return {
		EntityManager: EntityManager,
		/**
		 * Register the components. Must be called before instantiating EntityManager.
		 * Sets the property componentId on the supplied components.
		 * @param {...Object} var_args - The components.
		 */
		registerComponents: function() {
			for (var i = 0, length = arguments.length; i < length; ++i) {
				var component = arguments[i];
				component.componentId = i;
				component.components = [];
			}
		},
		getMask: function(components) {
			var mask = new BitSet();
			for (var i = 0, length = components.length; i < length; i++) {
				mask.set(components[i].componentId);
			}
			return mask;
		}
	};
}());
