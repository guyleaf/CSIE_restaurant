<?php

/** @var \Laravel\Lumen\Routing\Router $router */

/*
|--------------------------------------------------------------------------
| Api Routes
|--------------------------------------------------------------------------
|
| Here is where you can register all of the routes for an application.
| It is a breeze. Simply tell Lumen the URIs it should respond to
| and give it the Closure to call when that URI is requested.
|
*/

$router->get('/', function () use ($router) {
    return $router->app->version();
});

$router->group(['prefix' => 'auth'], function () use ($router) {
    $router->post('login', 'AuthController@login');

    $router->group(['middleware' => 'jwt.auth'], function () use ($router) {
        $router->post('logout', 'AuthController@logout');
        $router->post('refresh', 'AuthController@refresh');
        $router->post('', 'AuthController@me');
    });
});

$router->group(['prefix' => 'restaurants'], function () use ($router) {
    $router->get('', 'ShopController@getShops');
    $router->get('category', 'ShopController@getCategories');
    $router->get('{id}/products', 'ShopController@getItems');
    $router->get('{id}/category', 'ShopController@getProductCategories');
    $router->get('{id}/Info', 'ShopController@getShopInfo');
});

$router->group(['prefix' => 'members'], function () use ($router) {
    $router->get('', 'MemberController@getMembers');
});

$router->group(['prefix' => 'customer'], function () use ($router) {
    $router->get('orders', 'CustomerController@getOrders');
    $router->get('orders/{orderId}', 'CustomerController@getOrderInfo');
    $router->group(['middleware' => 'jwt.auth'], function () use ($router) {
        
    });
});
?>
