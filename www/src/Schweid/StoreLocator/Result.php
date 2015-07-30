<?php
/**
 * Copyright (C) 2014  Night Agency, LLC.
 * DO NOT REDISTRIBUTE
 *
 * @author Ramon Torres <raymondjavaxx@gmail.com>
 */

namespace Schweid\StoreLocator;

/**
 * Store Locator Result
 */
class Result implements \JsonSerializable {

	/**
	 * Store
	 * @var Store
	 */
	protected $_store;

	/**
	 * Dinstance to store in Kilometers.
	 * @var float
	 */
	protected $_distance;

	/**
	 * Constructor
	 * @param Store $store The store.
	 * @param float $store Distance to the store in Kilometers.
	 */
	public function __construct(Store $store, $distance)
	{
		$this->_store = $store;
		$this->_distance = $distance;
	}

	/**
	 * Returns the store associated with this result.
	 * @return Store
	 */
	public function store()
	{
		return $this->_store;
	}

	/**
	 * Returns the distance to the store in this result entry.
	 * @return float The distance in Kilometers
	 */
	public function distance()
	{
		return $this->_distance;
	}

	/**
	 * JSON serialization interface
	 * @return array KV properties to serialize
	 * @see \JsonSerializable
	 */
	public function jsonSerialize()
	{
		return array(
			'distance' => $this->distance(),
			'store'    => $this->store()
		);
	}
}
