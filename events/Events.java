package dev.hannah.events;

public class Events {

    private int eventID;
    private String title;
    private String description;
    private String eventDate;
    private String eventTime;
    private int venueID;

    public Events(int eventID, String eventTitle, String description, String eventDate, String eventTime, int venueID) {
        this.eventID = eventID;
        this.title = eventTitle;
        this.description = description;
        this.eventDate = eventDate;
        this.eventTime = eventTime;
        this.venueID = venueID;

    }


    public int getEventID() {
        return eventID;
    }

    public void setEventID(int eventID) {
        this.eventID = eventID;
    }

    public String getEventDate() {
        return eventDate;
    }

    public void setEventDate(String eventDate) {
        this.eventDate = eventDate;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }


    public String getEventTime() {
        return eventTime;
    }

    public void setEventTime(String eventTime) {
        this.eventTime = eventTime;
    }

    public int getVenueID() {
        return venueID;
    }

    public void setVenueID(int venueID) {
        this.venueID = venueID;
    }

}