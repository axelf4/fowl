var fowl = (function() {
	"use strict";
	var INITIAL_SIZE = 1024;
	var componentCount = 0;
	var EntityManager = function() {
		this.components = new Array(componentCount * INITIAL_SIZE);
		this.entityMask = new Uint32Array(INITIAL_SIZE);
		this.pool = [];
	};
	EntityManager.prototype.count = 0;
	EntityManager.prototype.createEntity = function() {
		var entity = this.pool.length > 0 ? this.pool.pop() : this.count++;
		if (entity >= this.entityMask.length) {
			var tmp = this.entityMask;
			(this.entityMask = new Uint32Array(tmp.length * 1.5)).set(tmp);
		}
		return entity;
	};
	EntityManager.prototype.removeEntity = function(entity) {
		this.entityMask[entity] = 0;
		this.pool.push(entity);
	};
	EntityManager.prototype.addComponent = function(entity, component) {
		var key = component.constructor.componentId;
		this.entityMask[entity] |= 1 << key;
		return this.components[componentCount * entity + key] = component;
	};
	EntityManager.prototype.removeComponent = function(entity, component) {
		this.entityMask[entity] &= ~(1 << component.componentId);
	};
	EntityManager.prototype.getComponent = function(entity, key) {
		return this.components[componentCount * entity + key.componentId];
	};
	EntityManager.prototype.clear = function() {
		this.entityMask.fill(0);
		this.components = [];
	};
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
			registerComponents: function(components) {
				if (arguments.length > 32) throw new RangeError("Too many components");
				for (var i = 0, length = arguments.length; i < length; ++i) {
					arguments[i].componentId = i;
				}
				componentCount = arguments.length;
			}
	};
}());
