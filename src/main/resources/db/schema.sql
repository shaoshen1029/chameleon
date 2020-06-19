create table if not exists t_kidnap
(
    id     VARCHAR(32) not null primary key,
    schema VARCHAR(5),
    method VARCHAR(8),
    host   VARCHAR(128),
    port   NUMBER(5),
    path   VARCHAR(512),
    regex  VARCHAR(512)
);