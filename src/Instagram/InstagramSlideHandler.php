<?php

namespace ComeenPlay\Instagram\Instagram;

use Carbon\Carbon;
use ComeenPlay\SdkPhp\Handlers\SlideHandler;
use ComeenPlay\SdkPhp\Interfaces\ISlide;
use ComeenPlay\SdkPhp\Interfaces\IDisplay;

class InstagramSlideHandler extends SlideHandler
{

    public function fetch(ISlide $slide, IDisplay $display): void
    {
        $options = $slide->getOptions();
        $expiration = Carbon::now()->addHour();
        $cache_uuid = $options['pageId'];

        
        $driver = $this->getAuthProvider($slide->getAccounts());
        if ($driver == null) return;

        if ($options['pageId']) {
            $cache_key =  $driver->getProviderIdentifier() . "_{$cache_uuid}_{$options['pageId']}";

            $photos = $driver->getPhotos($options["pageId"], $options["pageNumber"]);
            $api_response = [$photos, $driver->getPageDetails($options["pageId"])];

            $user = $api_response[1];
            $photos = $api_response[0];
            foreach ($photos as $photo) {
                $this->addSlide([
                    'attachmentUrl' => $photo["url"],
                    'text' => $photo["caption"],
                    'publicationDate' => $photo["date"],
                    'user' => $user,
                ]);
            }
        }
    }
}
