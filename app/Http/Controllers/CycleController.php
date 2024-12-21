<?php

namespace App\Http\Controllers;

use App\Models\Cycle;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class CycleController extends Controller
{
    public function index()
    {
        $cycles = Cycle::paginate(1); 
        return Inertia::render('Cycles/Index', [
            'cycles' => $cycles,
        ]);
    }

    public function create()
    {
        return Inertia::render('Cycles/Form');
    }

    public function store(Request $request)
    {
        log::info('request');
        log::info($request->description);
        $request->validate([
            'description'          => 'required|string|max:255',
            'start_date'           => 'required|date',
            'end_date'             => 'required|date',
            'vacation_start_date'  => 'nullable|date',
            'vacation_end_date'    => 'nullable|date',
        ]);
        Cycle::create([
            'description'          => $request->description,
            'start_date'           => $request->start_date,
            'end_date'             => $request->end_date,
            'vacation_start_date'  => $request->vacation_start_date,
            'vacation_end_date'    => $request->vacation_start_date,
            'created_by' => auth()->id(),
        ]);

        return redirect()->route('cycles.index')->with('success', 'Cycle created successfully!');
    }

    public function edit(Cycle $cycle)
    {
        return Inertia::render('Cycles/Form', [
            'cycle' => $cycle,
        ]);
    }

    public function update(Request $request, Cycle $cycle)
    {
        $request->validate([
            'description'          => 'required|string|max:255',
            'start_date'           => 'required|date',
            'end_date'             => 'required|date',
            'vacation_start_date'  => 'nullable|date',
            'vacation_end_date'    => 'nullable|date',
        ]);
        $cycle->update([
            'description'          => $request->description,
            'start_date'           => $request->start_date,
            'end_date'             => $request->end_date,
            'vacation_start_date'  => $request->vacation_start_date,
            'vacation_end_date'    => $request->vacation_start_date,
            'updated_by' => auth()->id(),
        ]);

        return redirect()->route('cycles.index')->with('success', 'Cycle updated successfully!');
    }

    public function destroy(Cycle $cycle)
    {
        $cycle->delete();
        return redirect()->route('cycles.index')->with('success', 'Cycle deleted successfully!');
    }
}
