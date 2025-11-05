<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class ScanController extends Controller
{
    public function scanDocument(Request $request, $type)
    {
        
        $request->validate([
            'document' => 'required|file|mimes:jpg,jpeg,png,pdf|max:5120',
        ]);

        $file = $request->file('document');
        Log::info('file data');
        Log::info($file);
        Log::info(env('OCR_SPACE_API_KEY'));
       
        if ($type === 'pink_card') {
            $response = Http::attach(
                'file', file_get_contents($file), $file->getClientOriginalName()
            )->post('https://api.ocr.space/parse/image', [
                'apikey' => 'K81551677988957',
                'language' => 'tha',
                'OCREngine' => 2, 
                'scale' => 'true',
                'detectOrientation' => 'true',
            ]);
        } else {
            $response = Http::attach(
                'file', file_get_contents($file), $file->getClientOriginalName()
            )->post('https://api.ocr.space/parse/image', [
                'apikey' => 'K81551677988957',
                'language' => 'eng',
                'OCREngine' => 2, 
                'scale' => 'true',
                'detectOrientation' => 'true',
            ]);
        }

        $result = $response->json();
        Log::info($result);

        $text = $result['ParsedResults'][0]['ParsedText'] ?? '';
        Log::info($text);
        $returnFields = $this->extractFields($type, $text);
        Log::info($returnFields);

        return response()->json([
            'raw_text' => $text,
            'fields' => $returnFields,
        ]);
    }

    private function extractFields($type, $text)
    {
        if ($type === 'passport') {
            // Match Passport Number after "Passport No"
            preg_match('/Passport\s*No\s*\n?([A-Z0-9]+)/i', $text, $passportMatch);
            $passport_no = $passportMatch[1] ?? null;

            preg_match('/Date\s*of\s*expiry\s*\n?([0-9]{1,2}\s+[A-Z]{3,9}\s+[0-9]{4})/i', $text, $expiryMatch);
            $passport_expiry_raw = $expiryMatch[1] ?? null;

            $passport_expiry = null;
            if ($passport_expiry_raw) {
                $dateObj = \DateTime::createFromFormat('d M Y', $passport_expiry_raw);
                if ($dateObj) {
                    $passport_expiry = $dateObj->format('Y-m-d'); 
                }
            }

            return [
                'passport_no' => $passport_no,
                'passport_expiry' => $passport_expiry,
            ];
        }

        if ($type === 'visa') {
            // Example: Visa number pattern, adjust as needed
            preg_match('/[A-Z0-9]{6,10}/', $text, $matches);
            $visa_type = $matches[0] ?? null;

            // Try to find expiry date in common formats
            preg_match('/\d{2}\/\d{2}\/\d{4}/', $text, $dates);
            $visa_expiry = $dates[0] ?? null;

            return [
                'visa_type' => $visa_type,
                'visa_expiry' => $visa_expiry,
            ];
        }

        if ($type === 'ci') {
            // Match CI Number
            preg_match('/CIO\s*NO[:\s]*([A-Z0-9]+)/', $text, $matches);
            $ci_no = $matches[1] ?? null;

            preg_match('/Date\s*of\s*expiry\s*\n?([0-9]{1,2}\s+[A-Z]{3,9}\s+[0-9]{4})/i', $text, $expiryMatch);
            $ci_expiry_raw = $expiryMatch[1] ?? null;

            $ci_expiry = null;
            if ($ci_expiry_raw) {
                $dateObj = \DateTime::createFromFormat('d M Y', $ci_expiry_raw);
                if ($dateObj) {
                    $ci_expiry = $dateObj->format('Y-m-d'); 
                }
            }

            return [
                'ci_no' => $ci_no,
                'ci_expiry' => $ci_expiry,
            ];
        }

        if ($type === 'pink_card') {
            preg_match('/\d{2}\s\d{4}\s\d{6}\s\d/', $text, $pinkCardMatch);
            $pink_card_no = $pinkCardMatch[0] ?? null;

            preg_match('/(\d{1,2}\s+[A-Za-z]{3,9}\s+\d{4})(?=\s*Date of Expiry)/i', $text, $expiryMatch);
            $pink_card_expiry_raw = $expiryMatch[1] ?? null;

            $pink_card_expiry = null;
            if ($pink_card_expiry_raw) {
                $dateObj = \DateTime::createFromFormat('d M Y', $pink_card_expiry_raw);
                if ($dateObj) {
                    $pink_card_expiry = $dateObj->format('Y-m-d');
                }
            }

            return [
                'pink_card_no' => $pink_card_no,
                'pink_card_expiry' => $pink_card_expiry,
            ];
        }

        return [];
    }
}
