<?php

require dirname(__DIR__) . '/vendor/autoload.php';
date_default_timezone_set('America/New_York');

use \Schweid\Products\ProductCollection;

$app = new \Slim\Slim();

$app->config(array(
	'view' => new \Slim\Views\Twig(),
	'log.enable' => false,
	'debug' => true,
	'templates.path' => dirname(__DIR__) . '/templates'
));

$app->view()->parserExtensions = array(
	new \Slim\Views\TwigExtension()
);

$app->view()->parserOptions = array(
	'debug' => true,
	'cache' => dirname(__DIR__) . '/cache'
);

$app->get('/', function () use ($app) {
	$app->render('home.html.twig');
});

$app->get('/products/', function () use ($app) {
	$path = dirname(__DIR__) . '/data/products.yml';
	$products = ProductCollection::fromYaml($path);
	$app->render('products.html.twig', compact('products'));
});

$app->get('/products/:slug', function ($slug) use ($app) {
	$path = dirname(__DIR__) . '/data/products.yml';
	$product = ProductCollection::fromYaml($path)->findBySlug($slug);
	$app->render('product.html.twig', compact('product'));
});

$app->get('/sitemap.xml', function () use ($app) {
	$path = dirname(__DIR__) . '/data/products.yml';
	$products = ProductCollection::fromYaml($path);

	$app->response->header('Content-type', 'application/xml');
	$app->render('sitemap.xml.twig', compact('products'));
});

$app->get('/connect/', function () use ($app) {
	$app->render('connect.html.twig');
});

$app->get('/heritage/', function () use ($app) {
	$app->render('heritage.html.twig');
});

$app->get('/api/stores/', function () use ($app) {
	$req = $app->request();

	$lat = (float)$req->get('lat');
	$lon = (float)$req->get('lon');

	$locator = new \Schweid\StoreLocator\Locator(dirname(__DIR__) . '/data/stores.csv');
	$stores = $locator->storesNear(new \Schweid\StoreLocator\GeoPoint($lat, $lon));

	$app->response->header('Content-type', 'application/json');
	$app->render('stores.json.twig', compact('stores'));
});

$app->get('/locations', function () use ($app) {
	$app->render('locations.html.twig');
});

$app->run();
