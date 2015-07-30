<?php
/**
 * Copyright (C) 2014  Night Agency, LLC.
 * DO NOT REDISTRIBUTE
 *
 * @author Ramon Torres <raymondjavaxx@gmail.com>
 */

namespace Schweid\StoreLocator;

use \Keboola\Csv\CsvFile;

/**
 * Locator
 * Implements the login for the store locator.
 */
class Locator {

	// 10 miles in kilometers
	const MAX_RADIUS = 16.0934;

	/**
	 * All the stores
	 * @var array
	 */
	protected $_stores = array();

	/**
	 * Constructor
	 * @param string $path Path to CSV file containing list of stores.
	 */
	public function __construct($path)
	{
		$csv = new CsvFile($path);

		$keys = array(
			'store',
			'wf',
			'name',
			'address',
			'city',
			'state',
			'zipcode',
			'phone',
			'geo_location'
		);

		foreach ($csv as $i => $row) {
			if ($i > 0) { // Skip header
				$data = array_combine($keys, $row);
				$this->_stores[] = new Store($data);
			}
		}
	}

	/**
	 * Finds all the stores near `$location`.
	 * @param GeoPoint $location
	 * @return array Array of Result objects.
	 */
	public function storesNear(GeoPoint $location)
	{
		$results = array();

		foreach ($this->_stores as $store) {
			$distance = $store->distanceTo($location);
			if ($distance <= static::MAX_RADIUS) {
				$results[] = new Result($store, $distance);
			}
		}

		// Sort results by distance
		usort($results, function ($a, $b) {
			if ($a->distance() == $b->distance()) {
				return 0;
			}

			return ($a->distance() > $b->distance()) ? 1 : -1;
		});

		return $results;
	}
}
