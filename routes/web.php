<?php

use App\Http\Controllers\AgentController;
use App\Http\Controllers\ApplicantController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\CustomerController;
use App\Http\Controllers\CustomerServiceController;
use App\Http\Controllers\JobController;
use App\Http\Controllers\LineController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\RoleController;
use App\Http\Controllers\ScanController;
use App\Http\Controllers\ServiceController;
use App\Http\Controllers\ShortUrlController;
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
        Route::resource('agents', AgentController::class);
        Route::resource('services', ServiceController::class);

        Route::prefix('customers')->name('customers.')->group(function () {
            Route::get('/import', [CustomerController::class, 'importForm'])->name('import');            
            Route::post('/import', [CustomerController::class, 'import'])->name('import_submit');        
            Route::get('/import-format', [CustomerController::class, 'importFormat'])->name('import-format'); 
            Route::get('/expiry/{type?}', [CustomerController::class, 'expiry'])->name('expiry');  
            Route::get('/new', [CustomerController::class, 'newCustomersThisMonth'])->name('new');                   

            // Route::get('/export', [CustomerController::class, 'export'])->name('export');
            // Route::post('/filter', [CustomerController::class, 'index'])->name('filter');
        });
        Route::resource('customers', CustomerController::class);

        Route::get('/customer-services/export', [CustomerServiceController::class, 'export'])->name('customer-services.export');
        Route::resource('customer-services', CustomerServiceController::class);

        Route::resource('jobs', JobController::class);
        Route::resource('applicants', ApplicantController::class);
    });
    
});

Route::get('/customer-services/view/{id}', [CustomerServiceController::class, 'view'])->name('customer-services.view');


Route::post('/line-webhook', [LineController::class, 'handleWebhook']);
Route::post('/send-line-message', [LineController::class, 'sendLineMessage']);

Route::get('/{shortUrl}', [ShortUrlController::class, 'redirect']);

Route::post('/scan/{type}', [ScanController::class, 'scanDocument']);






