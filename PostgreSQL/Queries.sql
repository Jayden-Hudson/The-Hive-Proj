

-- EVENT REQUEST / CONTACT TABLES

CREATE TABLE eventrequest (
    requestid INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    eventtype TEXT NOT NULL,
    performers TEXT NOT NULL,
    starttime TEXT NOT NULL,
    expectedattendance TEXT NOT NULL,
    agerange VARCHAR(50) NOT NULL,
    eventbudget TEXT NOT NULL,
    additionaleventdetails TEXT
);


CREATE TABLE contactinfo (
    contactinfoid INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    companyname VARCHAR(150) NOT NULL,
    contactfirstname VARCHAR(100) NOT NULL,
    contactlastname VARCHAR(100) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    email VARCHAR(255) NOT NULL,
    besttimetobereached VARCHAR(100) NOT NULL,
    links TEXT,
    additionalcontactnotes TEXT,
    requestid INT NOT NULL,
    CONSTRAINT fk_contactinfo_request
        FOREIGN KEY (requestid) REFERENCES eventrequest(requestid)
);


-- CORE TABLES

CREATE TABLE venue (
    venueid INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    address VARCHAR(100) NOT NULL,
    city VARCHAR(100) NOT NULL,
    state CHAR(2) NOT NULL,
    capacity INT NOT NULL
);


CREATE TABLE buyer (
    buyerid INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    firstname VARCHAR(100) NOT NULL,
    lastname VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    phone VARCHAR(20) NOT NULL
);


CREATE TABLE account (
    userid INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    username VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    buyerid INT NOT NULL UNIQUE,
    CONSTRAINT fk_account_buyer
        FOREIGN KEY (buyerid) REFERENCES buyer(buyerid)
);


CREATE TABLE orders (
    orderid INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    buyerid INT NOT NULL,
    confirmationnum VARCHAR(100) NOT NULL UNIQUE,
    allinticketprice NUMERIC(10,2) NOT NULL DEFAULT 0.00,
    salestax NUMERIC(10,2) NOT NULL DEFAULT 0.00,
    parkingpassamount NUMERIC(10,2) NOT NULL DEFAULT 0.00,
    eventprotection NUMERIC(10,2) NOT NULL DEFAULT 0.00,
    ordertotal NUMERIC(10,2) NOT NULL,
    orderdate TEXT,
    CONSTRAINT fk_orders_buyer
        FOREIGN KEY (buyerid) REFERENCES buyer(buyerid)
);


CREATE TABLE cardinfo (
    cardid INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    buyerid INT NOT NULL,
    cardnum VARCHAR(25) NOT NULL,
    expirationdate VARCHAR(7) NOT NULL,
    cvv VARCHAR(4) NOT NULL,
    address VARCHAR(255) NOT NULL,
    city VARCHAR(100) NOT NULL,
    state CHAR(2) NOT NULL,
    zip VARCHAR(10) NOT NULL,
    expirationYear VARCHAR(7) NOT NULL,
    CONSTRAINT fk_cardinfo_buyer
        FOREIGN KEY (buyerid) REFERENCES buyer(buyerid)
);


-- STAFF / EVENT TABLES

CREATE TABLE department (
    departmentid INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    departmentname VARCHAR(100) NOT NULL
);


CREATE TABLE employee (
    employeeid INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    firstname VARCHAR(100) NOT NULL,
    lastname VARCHAR(100) NOT NULL,
    dob DATE,
    address VARCHAR(255),
    zipcode VARCHAR(10),
    city VARCHAR(100),
    state CHAR(2),
    managerid INT,
    departmentid INT,
    employee CHAR (50),
    CONSTRAINT fk_employee_manager
        FOREIGN KEY (managerid) REFERENCES employee(employeeid),
    CONSTRAINT fk_employee_department
        FOREIGN KEY (departmentid) REFERENCES department(departmentid)
);

CREATE TABLE manager (
    managerid INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    employeeid INT UNIQUE NOT NULL,
    firstname VARCHAR(100) NOT NULL,
    lastname VARCHAR(100) NOT NULL,
    address VARCHAR(255),
    zipcode VARCHAR(10),
    city VARCHAR(100),
    state CHAR(2),
    departmentid INT,
    username VARCHAR(50) NOT NULL UNIQUE,
    passwordhash VARCHAR(255) NOT NULL,
    CONSTRAINT fk_manager_employee
        FOREIGN KEY (employeeid) REFERENCES employee(employeeid),
    CONSTRAINT fk_manager_department
        FOREIGN KEY (departmentid) REFERENCES department(departmentid)
);


CREATE TABLE event (
    eventid INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    title VARCHAR(150) NOT NULL,
    description TEXT,
    eventdate DATE NOT NULL,
    eventtime TIME NOT NULL, --Time without time zone time put will not adjust by region
    venueid INT NOT NULL,
    requestid INT,
    CONSTRAINT fk_event_venue
        FOREIGN KEY (venueid) REFERENCES venue(venueid),
    CONSTRAINT fk_event_request
        FOREIGN KEY (requestid) REFERENCES eventrequest(requestid)
);


CREATE TABLE performers (
    performerid INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    eventid INT NOT NULL,
    CONSTRAINT fk_performers_event
        FOREIGN KEY (eventid) REFERENCES event(eventid)
);


CREATE TABLE review (
    reviewid INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    comment TEXT,
    rating INT NOT NULL CHECK (rating BETWEEN 1 AND 5), --Can be flexible or changed restrict through code as well
    buyerid INT NOT NULL,
    eventid INT NOT NULL,
    CONSTRAINT fk_review_buyer
        FOREIGN KEY (buyerid) REFERENCES buyer(buyerid),
    CONSTRAINT fk_review_event
        FOREIGN KEY (eventid) REFERENCES event(eventid)
);


-- SECTION / ROW / TICKET TABLES

CREATE TABLE sections (
    sectionid INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    eventid INT NOT NULL,
    numrows INT NOT NULL DEFAULT 0,
    numticketsavailable INT NOT NULL DEFAULT 0,
    numticketssold INT NOT NULL DEFAULT 0,
    soldout BOOLEAN NOT NULL DEFAULT FALSE,
    CONSTRAINT fk_sections_event
        FOREIGN KEY (eventid) REFERENCES event(eventid)
);


CREATE TABLE seatrows (
    rowid INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    sectionid INT NOT NULL,
    numticketsavailable INT NOT NULL DEFAULT 0,
    numticketssold INT NOT NULL DEFAULT 0,
    soldout BOOLEAN NOT NULL DEFAULT FALSE,
    CONSTRAINT fk_seatrows_section
        FOREIGN KEY (sectionid) REFERENCES sections(sectionid)
);


CREATE TABLE ticket (
    ticketid INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    sectionid INT NOT NULL,
    rowid INT,
    seatnumber INT,
    sold BOOLEAN NOT NULL DEFAULT FALSE,
    orderid INT,
    price NUMERIC(10,2) NOT NULL,
    eventid INT NOT NULL,
    checkintime TIMESTAMP,
    CONSTRAINT fk_ticket_section
        FOREIGN KEY (sectionid) REFERENCES sections(sectionid),
    CONSTRAINT fk_ticket_row
        FOREIGN KEY (rowid) REFERENCES seatrows(rowid),
    CONSTRAINT fk_ticket_order
        FOREIGN KEY (orderid) REFERENCES orders(orderid),
    CONSTRAINT fk_ticket_event
        FOREIGN KEY (eventid) REFERENCES event(eventid)
);

CREATE TABLE moshpitticket (
    pitticketid INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    pitid INT NOT NULL,
    eventid INT NOT NULL,
    orderid INT,
    sold BOOLEAN NOT NULL DEFAULT FALSE,
    price NUMERIC(10,2) NOT NULL,
    qrcode VARCHAR(255),
    checkintime TIMESTAMP,
    CONSTRAINT fk_moshpitticket_pit
        FOREIGN KEY (pitid) REFERENCES moshpit(pitid),
    CONSTRAINT fk_moshpitticket_event
        FOREIGN KEY (eventid) REFERENCES event(eventid),
    CONSTRAINT fk_moshpitticket_order
        FOREIGN KEY (orderid) REFERENCES orders(orderid)
);


CREATE TABLE seathold (
    holdid INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    expirationtime TIMESTAMP NOT NULL,
    ticketid INT NOT NULL,
    buyerid INT NOT NULL,
    CONSTRAINT fk_seathold_ticket
        FOREIGN KEY (ticketid) REFERENCES ticket(ticketid),
    CONSTRAINT fk_seathold_buyer
        FOREIGN KEY (buyerid) REFERENCES buyer(buyerid)
);

CREATE TABLE moshpit (
    pitid INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    eventid INT NOT NULL UNIQUE,
    pitname VARCHAR(100) NOT NULL DEFAULT 'Mosh Pit',
    maxcapacity INT NOT NULL DEFAULT 150 CHECK (maxcapacity <= 150),
    peopleassigned INT NOT NULL DEFAULT 0,
    soldout BOOLEAN NOT NULL DEFAULT FALSE,
    CONSTRAINT fk_moshpit_event
        FOREIGN KEY (eventid) REFERENCES event(eventid)
);

-- PAYMENT / REFUND / COUPON TABLES

CREATE TABLE payment (
    paymentid INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    amount NUMERIC(10,2) NOT NULL,
    paymentdate TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    orderid INT NOT NULL,
    CONSTRAINT fk_payment_order
        FOREIGN KEY (orderid) REFERENCES orders(orderid)
);


CREATE TABLE refund (
    refundid INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    paymentid INT NOT NULL,
    amount NUMERIC(10,2) NOT NULL,
    reason VARCHAR(255),
    refunddate TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_refund_payment
        FOREIGN KEY (paymentid) REFERENCES payment(paymentid)
);


CREATE TABLE coupons (
    couponcode VARCHAR(50) PRIMARY KEY,
    discountamount NUMERIC(10,2) NOT NULL,
    expirationdate DATE NOT NULL
);


CREATE TABLE redemptions (
    redemptionid INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    redemptiondate TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    buyerid INT NOT NULL,
    orderid INT NOT NULL,
    couponcode VARCHAR(50) NOT NULL,
    CONSTRAINT fk_redemptions_buyer
        FOREIGN KEY (buyerid) REFERENCES buyer(buyerid),
    CONSTRAINT fk_redemptions_order
        FOREIGN KEY (orderid) REFERENCES orders(orderid),
    CONSTRAINT fk_redemptions_coupon
        FOREIGN KEY (couponcode) REFERENCES coupons(couponcode)
);


-- PARKING TABLES

CREATE TABLE parking (
    eventid INT PRIMARY KEY,
    passesavailable INT NOT NULL DEFAULT 0,
    numpassessold INT NOT NULL DEFAULT 0,
    soldout BOOLEAN NOT NULL DEFAULT FALSE,
    CONSTRAINT fk_parking_event
        FOREIGN KEY (eventid) REFERENCES event(eventid)
);


CREATE TABLE parkingpass (
    passid INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    price NUMERIC(10,2) NOT NULL,
    orderid INT NOT NULL,
    eventid INT NOT NULL,
    CONSTRAINT fk_parkingpass_order
        FOREIGN KEY (orderid) REFERENCES orders(orderid),
    CONSTRAINT fk_parkingpass_event
        FOREIGN KEY (eventid) REFERENCES event(eventid)
);


-- SCANNER TABLE

CREATE TABLE scanner (
    scanid INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    scanresult VARCHAR(100) NOT NULL,
    employeeid INT NOT NULL,
    ticketid INT NOT NULL,
    CONSTRAINT fk_scanner_employee
        FOREIGN KEY (employeeid) REFERENCES employee(employeeid),
    CONSTRAINT fk_scanner_ticket
        FOREIGN KEY (ticketid) REFERENCES ticket(ticketid)
);

-- Parking Lot

CREATE TABLE parking_lot (
    lotid INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    lotname VARCHAR(100) NOT NULL,
    locationdescription VARCHAR(255),
    maxcapacity INT NOT NULL CHECK (maxcapacity >= 0),
    covered BOOLEAN NOT NULL DEFAULT FALSE,
    securitylevel VARCHAR(50),
    notes TEXT
);

-- Each spot belongs to one parking lot
CREATE TABLE parking_spot (
    spotid INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    lotid INT NOT NULL,
    spotnumber VARCHAR(20) NOT NULL,
    spottype VARCHAR(30) NOT NULL DEFAULT 'Regular',
    isavailable BOOLEAN NOT NULL DEFAULT TRUE,
    isreserved BOOLEAN NOT NULL DEFAULT FALSE,
    hascharger BOOLEAN NOT NULL DEFAULT FALSE,

    CONSTRAINT fk_parking_spot_lot
        FOREIGN KEY (lotid) REFERENCES parking_lot(lotid)
        ON DELETE CASCADE,

    CONSTRAINT chk_spottype
        CHECK (spottype IN ('Regular', 'Accessible', 'VIP', 'Employee', 'Bus', 'Electric')),

    CONSTRAINT uq_lot_spotnumber
        UNIQUE (lotid, spotnumber)
);

-- A bus can be assigned to a parking lot and optionally a parking spot
CREATE TABLE venue_bus (
    busid INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    busnumber VARCHAR(30) NOT NULL UNIQUE,
    driverfirstname VARCHAR(100),
    driverlastname VARCHAR(100),
    licenseplate VARCHAR(20) NOT NULL UNIQUE,
    capacity INT NOT NULL CHECK (capacity > 0),
    busstatus VARCHAR(30) NOT NULL DEFAULT 'Active',
    lotid INT,
    assignedspotid INT,
    arrivaltime TIMESTAMP,
    departuretime TIMESTAMP,
    notes TEXT,

    CONSTRAINT fk_venue_bus_lot
        FOREIGN KEY (lotid) REFERENCES parking_lot(lotid)
        ON DELETE SET NULL,

    CONSTRAINT fk_venue_bus_spot
        FOREIGN KEY (assignedspotid) REFERENCES parking_spot(spotid)
        ON DELETE SET NULL,

    CONSTRAINT chk_busstatus
        CHECK (busstatus IN ('Active', 'Out of Service', 'Reserved', 'Parked'))
);
