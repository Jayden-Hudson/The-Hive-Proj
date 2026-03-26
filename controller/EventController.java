package dev.hannah.events.controller;

import dev.hannah.events.Events;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

    @RestController
    public class EventController {

        private final List<Events> events = new ArrayList<>();

        public EventController() {

            initializeSongs();
        }


        private void initializeSongs() {
            events.addAll(List.of(
                    new Events(1, "Test",  "Test event",  "2026-02-01",  "10AM",  1 ),
                    new Events(2, "Test2",  "Test event2",  "2026-02-02",  "7PM",  2 )
            ));
        }

        @GetMapping("/api/events")
        public List<Events> getEvents(@RequestParam(required = false) String eventTitle) {

            if (eventTitle == null) {
                return events;
            }

            List<Events> filteredEvents = new ArrayList<>();

            for (Events events : events) {

                if(events.getTitle().equalsIgnoreCase(eventTitle)) {
                    filteredEvents.add(events);
                }

        }
            return filteredEvents;
    }

    @GetMapping("/api/events/{eventTitle}")
        public Events getEventByTitle(@PathVariable String eventTitle) {

            for (Events events : events){
                if (events.getTitle().equalsIgnoreCase(eventTitle)){
                    return events;
                }
            }
            return null;
    }

    @PostMapping("/api/events")
        public void createSong(@RequestBody Events newEvent){

            for (Events events : events) {
                if(events.getTitle().equalsIgnoreCase(newEvent.getTitle())) {

                    return;
                }
            }

            events.add(newEvent);
    }


    @PutMapping("/api/events/{eventTitle}")
            public void updateEvent(@PathVariable String eventTitle, @RequestBody Events updatedEvent) {

                for(int i = 0; i < events.size(); i++) {

                    if (events.get(i).getTitle().equalsIgnoreCase(eventTitle)) {

                        events.set(i, updatedEvent);
                        return;
                    }

                }

        }


    @DeleteMapping("/api/events/{eventTitle}")
        public void deleteSong(@PathVariable String eventTitle) {
            for (int i = 0; i < events.size(); i++) {

                if(events.get(i).getTitle().equalsIgnoreCase(eventTitle)) {

                    events.remove(i);
                    return;
                }

            }
    }



}
