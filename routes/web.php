<?php
use App\Http\Controllers\AuthController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\CustomerController;
use App\Http\Controllers\CustomerServiceController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\RoleController;
use App\Http\Controllers\ServiceController;
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

Route::middleware(['auth'])->group(function () {

    Route::get('/profile/edit', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::post('/profile/update', [ProfileController::class, 'updateProfile'])->name('profile.update');

    Route::post('/logout', [AuthController::class, 'logout'])->name('logout');
    
    Route::get('/', [\App\Http\Controllers\HomeController::class,"dashboard"])->name("dashboard");
    Route::get('/dashboard', [\App\Http\Controllers\HomeController::class,"dashboard"])->name("dashboard");


    Route::middleware('check_permission')->group(function() {   
        Route::resource('categories', CategoryController::class); 
        Route::resource('roles', RoleController::class);
        Route::resource('users', UserController::class);
        Route::resource('services', ServiceController::class);

        Route::post('/customers/import', [CustomerController::class, 'import'])->name('customers.import');
        Route::get('/customers/export', [CustomerController::class, 'export'])->name('customers.export');
        Route::post('customers/filter', [CustomerController::class, 'index'])->name('customers.filter');
        Route::resource('customers', CustomerController::class);

        Route::get('/customer-services/export', [CustomerServiceController::class, 'export'])->name('customer-services.export');
        Route::post('customer-services/filter', [CustomerServiceController::class, 'index'])->name('customer-services.filter');
        Route::resource('customer-services', CustomerServiceController::class);
    });
    
});







