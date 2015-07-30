<?php
/**
 * Copyright (C) 2014  Night Agency, LLC.
 * DO NOT REDISTRIBUTE
 *
 * @author Ramon Torres <ramon@nightagency.com>
 */

namespace Schweid\Products;

class Product {

	/**
	 * Product data
	 * @var array
	 */
	protected $_data = array();

	/**
	 * Previous product
	 * @var Product
	 */
	protected $_previous;

	/**
	 * Next product
	 * @var Product
	 */
	protected $_next;

	/**
	 * Constructor
	 * @param array $data Product data.
	 */
	public function __construct($data)
	{
		$this->_data = $data;
	}

	/**
	 * Returns the URI for the product page
	 * @return string
	 */
	public function path()
	{
		return "/products/{$this->slug}";
	}

	public function __isset($property)
	{
		return isset($this->_data[$property]);
	}

	public function __get($property)
	{
		if (!array_key_exists($property, $this->_data)) {
			throw new \RuntimeException("Unknown property '{$property}'");
		}

		return $this->_data[$property];
	}

	public function __set($property, $value)
	{
		throw \RuntimeException("Model is read-only");
	}

	/**
	 * Sets the next product
	 * @param Product $next
	 */
	public function setNext(Product $next)
	{
		$this->_next = $next;
	}

	/**
	 * Returns the next product
	 * @return Product
	 */
	public function getNext()
	{
		return $this->_next;
	}

	/**
	 * Sets the previous product
	 * @param Product $previous
	 */
	public function setPrevious(Product $previous)
	{
		$this->_previous = $previous;
	}

	/**
	 * Returns the previous product
	 * @return Product
	 */
	public function getPrevious()
	{
		return $this->_previous;
	}
}
