<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\CourseController;
use App\Http\Controllers\CycleController;
use App\Http\Controllers\RoleController;
use App\Http\Controllers\TeacherController;
use App\Http\Controllers\UserController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia; 


Route::get('/welcome', function () {
    return Inertia::render('welcome');
});

Route::middleware('guest')->group(function () {
    Route::get('/login', [AuthController::class, 'showLoginForm'])->name('login');
    Route::get('/register', [AuthController::class, 'showRegisterForm'])->name('register');
    Route::post('/login', [AuthController::class, 'login']);
    Route::post('/register', [AuthController::class, 'register']);
});

Route::middleware('auth')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout'])->name('logout');
    
    Route::get('/', [\App\Http\Controllers\HomeController::class,"dashboard"])->name("home");
    Route::get('/dashboard', [\App\Http\Controllers\HomeController::class,"dashboard"])->name("dashboard");


    //setup
    Route::resource('categories', CategoryController::class);
    Route::resource('courses', CourseController::class);
    Route::resource('cycles', CycleController::class);

    //management
    Route::resource('roles', RoleController::class);
    Route::resource('users', UserController::class);
    Route::resource('teachers', TeacherController::class);
});





