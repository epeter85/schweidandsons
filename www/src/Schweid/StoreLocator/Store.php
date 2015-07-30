<?php
/**
 * Copyright (C) 2014  Night Agency, LLC.
 * DO NOT REDISTRIBUTE
 *
 * @author Ramon Torres <raymondjavaxx@gmail.com>
 */

namespace Schweid\StoreLocator;

/**
 * Store
 */
class Store implements \JsonSerializable {

	/**
	 * Store data in the form of Key-Value properties.
	 * @var array
	 */
	protected $_data = array();

	/**
	 * Cache for store coordinates.
	 * @var GeoPoint
	 * @see Store::point()
	 */
	protected $_point;

	/**
	 * Constructor
	 * @param array $data
	 */
	public function __construct($data)
	{
		$this->_data = $data;
	}

	/**
	 * Returns the distance to `$point`.
	 * @param GeoPoint $point
	 * @return float Distance in Kilometers
	 */
	public function distanceTo(GeoPoint $point)
	{
		return $this->point()->distanceTo($point);
	}

	/**
	 * JSON serialization interface
	 * @return array KV properties to serialize
	 * @see \JsonSerializable
	 */
	public function jsonSerialize()
	{
		return array(
			'name'    => $this->name(),
			'address' => $this->address(),
			'city'    => $this->city(),
			'state'   => $this->state(),
			'zipcode' => $this->zipcode(),
			'phone'   => trim($this->phone()),
			'lat'     => $this->point()->lat(),
			'lon'     => $this->point()->lon()
		);
	}

	public function get($key, $default = null)
	{
		if (!array_key_exists($key, $this->_data)) {
			return $default;
		}

		return $this->_data[$key];
	}

	/**
	 * Returns the name of the store.
	 * @return string
	 */
	public function name()
	{
		return $this->get('name');
	}

	/**
	 * Returns the street address of the store.
	 * @return string
	 */
	public function address()
	{
		return $this->get('address');
	}

	/**
	 * Returns the name of the city where the store is located at.
	 * @return string
	 */
	public function city()
	{
		return $this->get('city');
	}

	/**
	 * Returns the state where the store is located at.
	 * @return string
	 */
	public function state()
	{
		return $this->get('state');
	}

	/**
	 * Returns the Zip-Code for the store.
	 * @return string
	 */
	public function zipcode()
	{
		return $this->get('zipcode');
	}

	public function phone()
	{
		return $this->get('phone');
	}

	/**
	 * Returns the coordinates of the store.
	 * @return GeoPoint
	 */
	public function point()
	{
		if (is_null($this->_point)) {
			$coords = $this->get('geo_location');
			$this->_point = GeoPoint::fromCoordinatePairString($coords);
		}

		return $this->_point;
	}
}
