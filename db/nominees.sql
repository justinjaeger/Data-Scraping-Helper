CREATE TABLE `nominees` (
  `id` INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
  `awardsShow` VARCHAR(100) NOT NULL,
  `year` VARCHAR(5) NOT NULL,
  `category` VARCHAR(100) NOT NULL,
  `subcategory` VARCHAR(100),
  `film` VARCHAR(200) NOT NULL,
  `nominee` VARCHAR(200) NOT NULL,
  `winner` BIT(1) DEFAULT 0 NOT NULL
);
