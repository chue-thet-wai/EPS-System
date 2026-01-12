<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;


Route::middleware('auth:sanctum')->group(function () {
    Route::group(['namespace' => 'App\Http\Controllers\API'], function () {
        Route::post('/save-firebase-token', 'AccountController@saveFirebaseToken');
        Route::post('/save-profile', 'ProfileController@saveProfile');
        Route::get('/profile', 'ProfileController@getProfile');

        //Route::post('/change-password', 'AccountController@changePassword');
        Route::get('/categories', 'AgentController@getCategoryList');
        Route::get('/available-agents', 'AgentController@getAgentList');
        Route::get('/agent-detail', 'AgentController@getAgentDetail');
        
        Route::post('/request-service', 'ServiceController@requestService');
        
        Route::get('/customer-services-list', 'ServiceController@customerServicesList');        
        Route::get('/customer-service-detail', 'ServiceController@customerServiceDetail');

        Route::post('/save-review', 'ReviewController@saveReview');

        Route::get('/jobs', 'JobController@jobList');        
        Route::get('/job-detail', 'JobController@jobDetail');
        Route::post('/upload-cv', 'JobController@uploadCV');

        Route::get('/faqs', 'SettingController@faqs');   
        Route::get('/terms', 'SettingController@terms');   

        Route::get('/notifications', 'NotificationController@getNotifications');
        Route::post('/read-notification','NotificationController@markAsRead');

    });
});

Route::group(['namespace' => 'App\Http\Controllers\API'], function () {
    Route::post('/register', 'AuthController@register');
    Route::post('/login', 'AuthController@login');
    Route::post('/social-login', 'AuthController@socialLogin');
});
