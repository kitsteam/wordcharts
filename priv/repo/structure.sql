--
-- PostgreSQL database dump
--

-- Dumped from database version 12.12
-- Dumped by pg_dump version 14.5

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

--
-- Name: btree_gin; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS btree_gin WITH SCHEMA public;


--
-- Name: EXTENSION btree_gin; Type: COMMENT; Schema: -; Owner: -
--

COMMENT ON EXTENSION btree_gin IS 'support for indexing common datatypes in GIN';


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: clouds; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.clouds (
    id uuid NOT NULL,
    name character varying(255),
    settings jsonb DEFAULT '{}'::jsonb,
    admin_url_id uuid,
    inserted_at timestamp(0) without time zone NOT NULL,
    updated_at timestamp(0) without time zone NOT NULL,
    cloud_type character varying(255) DEFAULT ''::character varying
);


--
-- Name: schema_migrations; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.schema_migrations (
    version bigint NOT NULL,
    inserted_at timestamp(0) without time zone
);


--
-- Name: words; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.words (
    id uuid NOT NULL,
    name character varying(255) NOT NULL,
    cloud_id uuid NOT NULL,
    inserted_at timestamp(0) without time zone NOT NULL,
    updated_at timestamp(0) without time zone NOT NULL,
    grammatical_categories character varying(255)[] DEFAULT ARRAY[]::character varying[]
);


--
-- Name: clouds clouds_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.clouds
    ADD CONSTRAINT clouds_pkey PRIMARY KEY (id);


--
-- Name: schema_migrations schema_migrations_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.schema_migrations
    ADD CONSTRAINT schema_migrations_pkey PRIMARY KEY (version);


--
-- Name: words words_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.words
    ADD CONSTRAINT words_pkey PRIMARY KEY (id);


--
-- Name: words_cloud_id_grammatical_categories_name_index; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX words_cloud_id_grammatical_categories_name_index ON public.words USING gin (cloud_id, grammatical_categories, name);


--
-- Name: words words_cloud_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.words
    ADD CONSTRAINT words_cloud_id_fkey FOREIGN KEY (cloud_id) REFERENCES public.clouds(id);


--
-- PostgreSQL database dump complete
--

INSERT INTO public."schema_migrations" (version) VALUES (20221125143124);
INSERT INTO public."schema_migrations" (version) VALUES (20221130085550);
INSERT INTO public."schema_migrations" (version) VALUES (20221209093849);
INSERT INTO public."schema_migrations" (version) VALUES (20221228152401);
