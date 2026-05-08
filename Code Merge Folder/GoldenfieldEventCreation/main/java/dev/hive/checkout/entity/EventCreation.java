package dev.hive.checkout.entity;

import com.fasterxml.jackson.annotation.JsonProperty;
import java.time.LocalDate;
import java.time.LocalTime;

public class EventCreation {

    @JsonProperty("eventid")
    private Integer eventid;

    private String title;
    private String description;

    @JsonProperty("eventdate")
    private LocalDate eventDate;

    @JsonProperty("eventtime")
    private LocalTime eventTime;

    @JsonProperty("venueid")
    private Integer venueid;

    @JsonProperty("eventcancelled")
    private Boolean eventCancelled;

    public Integer getEventid() { return eventid; }

    public void setEventid(Integer eventid) { this.eventid = eventid; }

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

    public LocalDate getEventDate() {
        return eventDate;
    }

    public void setEventDate(LocalDate eventDate) {
        this.eventDate = eventDate;
    }

    public LocalTime getEventTime() {
        return eventTime;
    }

    public void setEventTime(LocalTime eventTime) {
        this.eventTime = eventTime;
    }

    public Integer getVenueid() { return venueid; }

    public void setVenueid(Integer venueid) {
        this.venueid = venueid;
    }

    public Boolean getEventCancelled() {
        return eventCancelled != null ? eventCancelled : false;
    }

    public void setEventCancelled(Boolean eventCancelled) {
        this.eventCancelled = eventCancelled;
    }
}

