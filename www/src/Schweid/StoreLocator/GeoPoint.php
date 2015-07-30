<?php
/**
 * Copyright (C) 2014  Night Agency, LLC.
 * DO NOT REDISTRIBUTE
 *
 * @author Ramon Torres <raymondjavaxx@gmail.com>
 */

namespace Schweid\StoreLocator;

/**
 * GeoPoint
 * Represents a latitude and longitude coordinate pair.
 */
class GeoPoint {

	// const EARTH_RADIUS = 6371000.0;

	/**
	 * Latitude
	 * @var float
	 */
	protected $_lat;

	/**
	 * Longitude
	 * @var float
	 */
	protected $_lon;

	/**
	 * Constructor
	 * @param float $lat Latitude
	 * @param float $lon Longitude
	 */
	public function __construct($lat, $lon)
	{
		$this->_lat = $lat;
		$this->_lon = $lon;
	}

	/**
	 * Returns a new `GeoPoint` from a coordinate pair string in the form of:
	 *
	 *     <pair-string> ::= <latitude> <separator> <longitude>
	 *     <separator>   ::= "," | ", "
	 *     <latitude>    ::= <float-value>
	 *     <longitude>   ::= <float-value>
	 *
	 * @param string $pair
	 * @return GeoPoint
	 */
	public static function fromCoordinatePairString($pair)
	{
		$parts = explode(',', $pair);

		if (count($parts) != 2) {
			throw new \Exception('Invalid pair');
		}

		$lat = floatval(trim($parts[0]));
		$lon = floatval(trim($parts[1]));

		return new static($lat, $lon);
	}

	/**
	 * Calculates the distance to another `GeoPoint`.
	 * @param GeoPoint $otherPoint
	 * @return float Distance in Kilometers
	 */
	public function distanceTo(GeoPoint $otherPoint)
	{
		$latDiff = $otherPoint->lat() - $this->lat();
		$lonDiff = $otherPoint->lon() - $this->lon();

		$theta = $this->lon() - $otherPoint->lon();
     	$distance = (sin(deg2rad($this->lat())) * sin(deg2rad($otherPoint->lat()))) +
     				(cos(deg2rad($this->lat())) * cos(deg2rad($otherPoint->lat())) * cos(deg2rad($theta)));

		$distance = acos($distance);
     	$distance = rad2deg($distance);

		$distance = $distance * 60 * 1.1515;
		$distance = $distance * 1.609344;

		return $distance;
	}

	// ------------------------------------
	//  Getters
	// ------------------------------------

	/**
	 * Returns the latitude
	 * @return float
	 */
	public function lat()
	{
		return $this->_lat;
	}

	/**
	 * Returns the longitude
	 * @return float
	 */
	public function lon()
	{
		return $this->_lon;
	}
}
