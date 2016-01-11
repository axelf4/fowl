var fowl = (function() { "use strict";
	var INITIAL_SIZE = 1024;
	var componentCount = 0;
	/**
	 * An entity manager.
	 * @constructor
	 */
	var EntityManager = function() {
		/**
		 * Array of all components associated with entities.
		 * @type {Object[]}
		 */
		this.components = new Array(componentCount * INITIAL_SIZE);
		/**
		 * Array of bitflags for each entity's component.
		 * @type {Uint32Array}
		 */
		this.entityMask = new Uint32Array(INITIAL_SIZE);
		/**
		 * Pool of availible entity identifiers.
		 * @type {number[]}
		 */
		this.pool = [];
	};
	/**
	 * The highest identifier that has been given to an entity.
	 * @type {number}
	 */
	EntityManager.prototype.count = 0;
	/**
	 * Create a new entity.
	 * @return {number} The identifier of the new entity.
	 */
	EntityManager.prototype.createEntity = function() {
		var entity = this.pool.length > 0 ? this.pool.pop() : this.count++;
		if (entity >= this.entityMask.length) {
			var tmp = this.entityMask;
			(this.entityMask = new Uint32Array(tmp.length * 1.5)).set(tmp);
		}
		return entity;
	};
	/**
	 * Remove the entity.
	 * @param {number} entity - The identifier of the entity to remove.
	 */
	EntityManager.prototype.removeEntity = function(entity) {
		this.entityMask[entity] = 0;
		this.pool.push(entity);
	};
	/**
	 * Assign a component to an entity.
	 * @param {number} entity - The entity.
	 * @param {?Object} component - The component.
	 * @return {?Object} The component.
	 */
	EntityManager.prototype.addComponent = function(entity, component) {
		var key = component.constructor.componentId;
		this.entityMask[entity] |= 1 << key;
		return this.components[componentCount * entity + key] = component;
	};
	/**
	 * Remove a component from an entity.
	 * @param {number} entity - The entity.
	 * @param {!Object} - The component.
	 */
	EntityManager.prototype.removeComponent = function(entity, component) {
		this.entityMask[entity] &= ~(1 << component.componentId);
	};
	/**
	 * Retrieve a component from an entity.
	 * @param {number} entity - The entity.
	 * @param {!Object} component - The component.
	 * @return {?Object} The component from the entity.
	 */
	EntityManager.prototype.getComponent = function(entity, component) {
		return this.entityMask[entity] & 1 << component.componentId ? this.components[componentCount * entity + component.componentId] : null;
	};
	/**
	 * Remove all entities.
	 */
	EntityManager.prototype.clear = function() {
		this.entityMask.fill(0);
	};
	/**
	 * Applies the callback to each entity with the specified components.
	 * @param {function(number)} callback - The callback.
	 * @param {...Object} Components that the entities mush have.
	 */
	EntityManager.prototype.each = function(callback) {
		var mask = 0;
		for (var i = 1; i < arguments.length; ++i) {
			mask |= 1 << arguments[i].componentId;
		}
		for (var i = 0, length = this.count; i < length; ++i) {
			if ((this.entityMask[i] & mask) === mask) {
				callback(i); // Call callback with the entity
			}
		}
	};
	return {
		EntityManager: EntityManager,
			/**
			 * Register the components. Must be called before instantiating EntityManager. Sets the property componentId on the supplied components.
			 * @param {...Object} var_args - The components.
			 */
			registerComponents: function() {
				if (arguments.length > 32) throw new RangeError("Too many components");
				for (var i = 0, length = arguments.length; i < length; ++i) {
					arguments[i].componentId = i;
				}
				componentCount = arguments.length;
			}
	};
}());
