--
-- PostgreSQL database dump
--

-- Dumped from database version 15.3
-- Dumped by pg_dump version 15.3

-- Started on 2024-02-25 21:00:11

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 215 (class 1259 OID 24780)
-- Name: Employees; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Employees" (
    id integer NOT NULL,
    ssn text NOT NULL,
    name text NOT NULL,
    dob date NOT NULL
);


ALTER TABLE public."Employees" OWNER TO postgres;

--
-- TOC entry 214 (class 1259 OID 24779)
-- Name: Employees_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public."Employees" ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public."Employees_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- TOC entry 217 (class 1259 OID 24788)
-- Name: Incident; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Incident" (
    id integer NOT NULL,
    name text NOT NULL,
    date date NOT NULL,
    description text NOT NULL
);


ALTER TABLE public."Incident" OWNER TO postgres;

--
-- TOC entry 216 (class 1259 OID 24787)
-- Name: Incident_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public."Incident" ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public."Incident_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- TOC entry 221 (class 1259 OID 24814)
-- Name: Suspect; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Suspect" (
    id integer NOT NULL,
    employee_id integer NOT NULL,
    testimonial_id integer NOT NULL
);


ALTER TABLE public."Suspect" OWNER TO postgres;

--
-- TOC entry 220 (class 1259 OID 24797)
-- Name: Testimonial; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Testimonial" (
    id integer NOT NULL,
    incident_id integer NOT NULL,
    employee_id integer NOT NULL,
    testimonial_text text NOT NULL
);


ALTER TABLE public."Testimonial" OWNER TO postgres;

--
-- TOC entry 218 (class 1259 OID 24795)
-- Name: Testimonial_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public."Testimonial" ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public."Testimonial_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- TOC entry 219 (class 1259 OID 24796)
-- Name: Testimonial_incident_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public."Testimonial" ALTER COLUMN incident_id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public."Testimonial_incident_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- TOC entry 3343 (class 0 OID 24780)
-- Dependencies: 215
-- Data for Name: Employees; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- TOC entry 3345 (class 0 OID 24788)
-- Dependencies: 217
-- Data for Name: Incident; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- TOC entry 3349 (class 0 OID 24814)
-- Dependencies: 221
-- Data for Name: Suspect; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- TOC entry 3348 (class 0 OID 24797)
-- Dependencies: 220
-- Data for Name: Testimonial; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- TOC entry 3355 (class 0 OID 0)
-- Dependencies: 214
-- Name: Employees_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."Employees_id_seq"', 1, false);


--
-- TOC entry 3356 (class 0 OID 0)
-- Dependencies: 216
-- Name: Incident_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."Incident_id_seq"', 1, false);


--
-- TOC entry 3357 (class 0 OID 0)
-- Dependencies: 218
-- Name: Testimonial_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."Testimonial_id_seq"', 1, false);


--
-- TOC entry 3358 (class 0 OID 0)
-- Dependencies: 219
-- Name: Testimonial_incident_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."Testimonial_incident_id_seq"', 1, false);


--
-- TOC entry 3189 (class 2606 OID 24786)
-- Name: Employees Employees_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Employees"
    ADD CONSTRAINT "Employees_pkey" PRIMARY KEY (id);


--
-- TOC entry 3191 (class 2606 OID 24794)
-- Name: Incident Incident_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Incident"
    ADD CONSTRAINT "Incident_pkey" PRIMARY KEY (id);


--
-- TOC entry 3195 (class 2606 OID 24818)
-- Name: Suspect Suspect_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Suspect"
    ADD CONSTRAINT "Suspect_pkey" PRIMARY KEY (id);


--
-- TOC entry 3193 (class 2606 OID 24803)
-- Name: Testimonial Testimonial_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Testimonial"
    ADD CONSTRAINT "Testimonial_pkey" PRIMARY KEY (id);


--
-- TOC entry 3198 (class 2606 OID 24819)
-- Name: Suspect Suspect_employee_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Suspect"
    ADD CONSTRAINT "Suspect_employee_id_fkey" FOREIGN KEY (employee_id) REFERENCES public."Employees"(id);


--
-- TOC entry 3199 (class 2606 OID 24824)
-- Name: Suspect Suspect_testimonial_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Suspect"
    ADD CONSTRAINT "Suspect_testimonial_id_fkey" FOREIGN KEY (testimonial_id) REFERENCES public."Testimonial"(id);


--
-- TOC entry 3196 (class 2606 OID 24809)
-- Name: Testimonial Testimonial_employee_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Testimonial"
    ADD CONSTRAINT "Testimonial_employee_id_fkey" FOREIGN KEY (employee_id) REFERENCES public."Employees"(id);


--
-- TOC entry 3197 (class 2606 OID 24804)
-- Name: Testimonial Testimonial_incident_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Testimonial"
    ADD CONSTRAINT "Testimonial_incident_id_fkey" FOREIGN KEY (incident_id) REFERENCES public."Incident"(id);


-- Completed on 2024-02-25 21:00:11

--
-- PostgreSQL database dump complete
--

