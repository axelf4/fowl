var fowl = (function() { "use strict";
	var componentCount;
	/**
	 * An entity manager.
	 * @constructor
	 */
	var EntityManager = function() {
		/**
		 * The highest identifier that has been given to an entity.
		 * @type {number}
		 */
		this.count = 0;
		/**
		 * Pool of availible entity identifiers.
		 * @type {number[]}
		 */
		this.pool = [];
		this.maskSize = Math.ceil(componentCount / 8);
		this.entityMask = new ArrayBuffer(0x10000);
		this.bitset = BitsetModule(window, null, this.entityMask);
		/**
		 * The number of allocated entity system masks.
		 */
		this.maskCount = 0;
		this.components = new Array(componentCount);
		for (var i = 0, length = componentCount; i < length; ++i) {
			this.components[i] = [];
		}
	};
	/**
	 * Create a new entity.
	 * @return {number} The identifier of the new entity.
	 */
	EntityManager.prototype.createEntity = function() {
		var entity = this.pool.length > 0 ? this.pool.pop() : this.count++;
		return entity;
	};
	/**
	 * Remove the entity.
	 * @param {number} entity - The identifier of the entity to remove.
	 */
	EntityManager.prototype.removeEntity = function(entity) {
		this.bitset.clear(entity * this.maskSize, this.maskSize);
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
		this.bitset.set(entity * this.maskSize, componentType.componentId);
		return this.components[componentType.componentId][entity] = component;
	};
	/**
	 * Remove a component from an entity.
	 * @param {number} entity - The entity.
	 * @param {!Object} - The component.
	 */
	EntityManager.prototype.removeComponent = function(entity, component) {
		this.bitset.reset(entity * this.maskSize, componentType.componentId);
	};
	/**
	 * Returns whether or not an entity has a specific component.
	 * @param {number} entity - The entity.
	 * @param {!Object} component - The component.
	 * @return {boolean} Whether the entity has the component.
	 */
	EntityManager.prototype.hasComponent = function(entity, component) {
		return this.bitset.isset(entity * this.maskSize, component.componentId);
	};
	/**
	 * Retrieve a component from an entity.
	 * @param {number} entity - The entity.
	 * @param {!Object} component - The component.
	 * @return {?Object} The component from the entity.
	 */
	EntityManager.prototype.getComponent = function(entity, component) {
		return this.components[component.componentId][entity];
	};
	/**
	 * Remove all entities.
	 */
	EntityManager.prototype.clear = function() {
		for (var i = 0, length = this.count; i < length; i++) {
			this.bitset.clear(i * this.maskSize);
		}
	};
	/**
	 * Applies the callback to each entity with the specified components.
	 * @param {function(number)} callback - The callback.
	 * @param {...Object} Components that the entities mush have.
	 */
	EntityManager.prototype.each = function(callback) {
		throw new Error("not implemented yet.");
		var mask = bitset.create();
		for (var i = 1; i < arguments.length; ++i) {
			bitset.set(mask, arguments[i].componentId);
		}
		for (var i = 0, length = this.count; i < length; ++i) {
			if (bitset.contains(mask, this.entityMask[i])) callback(i); // Call callback with the entity
		}
	};
	EntityManager.prototype.matches = function(entity, mask) {
		return this.bitset.contains(entity * this.maskSize, mask, this.maskSize);
	};
	EntityManager.prototype.getMask = function(components) {
		/*var mask = bitset.create();
		for (var i = 0, length = components.length; i < length; i++) {
			bitset.set(mask, components[i].componentId);
		}*/
		var mask = this.entityMask.byteLength - (++this.maskCount * this.maskSize);
		for (var i = 0, length = components.length; i < length; i++) {
			this.bitset.set(mask, components[i].componentId);
		}
		return mask;
	};
	return {
		EntityManager: EntityManager,
		/**
		 * Register the components. Must be called before instantiating EntityManager.
		 * Sets the property componentId on the supplied components.
		 * @param {...Object} var_args - The components.
		 */
		registerComponents: function() {
			componentCount = arguments.length;
			for (var i = 0, length = arguments.length; i < length; ++i) {
				var component = arguments[i];
				component.componentId = i;
			}
		}
	};
}());
