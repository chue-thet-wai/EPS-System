<?php

namespace App\Http\Controllers;

use App\Models\ShortUrl;

class ShortUrlController extends Controller
{
    public function redirect($shortUrl)
    {
        $shortUrl = ShortUrl::where('code', $shortUrl)->first();

        if (! $shortUrl) {
            abort(404); 
        }

        return redirect()->to($shortUrl->original_url);
    }

}
