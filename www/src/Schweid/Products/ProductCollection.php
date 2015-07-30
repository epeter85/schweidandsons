<?php
/**
 * Copyright (C) 2014  Night Agency, LLC.
 * DO NOT REDISTRIBUTE
 *
 * @author Ramon Torres <ramon@nightagency.com>
 */

namespace Schweid\Products;

use Symfony\Component\Yaml\Yaml;

class ProductCollection extends \ArrayObject {

	public static function fromYaml($path)
	{
		$products = array();

		$records = Yaml::parse($path);
		foreach ($records as $data) {
			$products[] = new Product($data);
		}

		// Create doubly-linked list ring
		$count = count($records);

		$first = $products[0];
		$last  = $products[$count - 1];

		for ($i=0; $i < $count; $i+=1) {
			$product = $products[$i];

			if ($product !== $first) {
				$product->setPrevious($products[$i - 1]);
			}

			if ($product !== $last) {
				$product->setNext($products[$i + 1]);
			}
		}

		$first->setPrevious($last);
		$last->setNext($first);

		return new ProductCollection($products);
	}

	public function find(\Closure $callback)
	{
		foreach ($this as $product) {
			if ($callback->__invoke($product)) {
				return $product;
			}
		}

		return null;
	}

	public function findBySlug($slug)
	{
		$product = $this->find(function ($product) use ($slug) {
			return (strcmp($product->slug, $slug) === 0);
		});

		if (!$product) {
			throw new ProductNotFoundException();
		}

		return $product;
	}
}
