<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Applicant;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class ApplicantController extends Controller
{

    public function index()
    {
        $applicants = Applicant::with(['customer.user'])
            ->paginate(config('common.paginate_per_page'));

        return Inertia::render('Applicants/Index', [
            'applicants' => $applicants,
            'pageTitle' => 'applicants',
        ]);
    }

    public function show(Applicant $applicant)
    {
        $applicant->load(['customer.user']);
        return Inertia::render('Applicants/Detail', [
            'applicant' => $applicant,
            'pageTitle' => 'applicantDetails',
        ]);
    }

}
