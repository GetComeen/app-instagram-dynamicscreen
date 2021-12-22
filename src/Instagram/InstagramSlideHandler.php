<?php

namespace DynamicScreen\Instagram\Instagram;

use Carbon\Carbon;
use DynamicScreen\SdkPhp\Handlers\SlideHandler;
use DynamicScreen\SdkPhp\Interfaces\ISlide;

class InstagramSlideHandler extends SlideHandler
{

    public function fetch(ISlide $slide): void
    {
        $options = $slide->getOptions();
        $expiration = Carbon::now()->addHour();
        $cache_uuid = $options['pageId'];

        $driver = $this->getAuthProvider($slide->getAccounts());
        if ($driver == null) return;

        $cache_key =  $driver->getProviderIdentifier() ."_{$cache_uuid}";
        if ($options['pageId']) {
            $api_response = app('cache')->remember($cache_key, $expiration, function () use ($options, $driver) {
                $photos = $driver->getPhotos($options["pageId"]);
                return [$photos, $driver->getName($options["pageId"])];
            });
            $photos = $api_response[0];
            $photos = array_slice($photos, 0, ($options['pageNumber'] * 5), true);
            foreach (collect($photos)->chunk(5) as $chunk) {
                $photos_to_send = [];
                foreach ($chunk as $photo) {
                    $photos_to_send[] = $photo;
                }
                $this->addSlide([
                    'instagram' => $photos_to_send,
                    'username' => $api_response[1],
                ]);
            }
        }
    }
}
