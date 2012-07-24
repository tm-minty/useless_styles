/* Table for incorrect useless style markup */

CREATE TABLE `useless_styles_errors` (
      `element` text NOT NULL,
      `url` varchar(255) NOT NULL,
      `add_date` date NOT NULL,
      `error_hash` varchar(32) NOT NULL,
      PRIMARY KEY (`error_hash`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1

/* Selectors dictionary */
CREATE TABLE `useless_styles_selectors` (
      `selector` text NOT NULL,
      `file` varchar(255) NOT NULL,
      `selector_hash` varchar(32) NOT NULL,
      PRIMARY KEY (`selector_hash`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=latin1

/* Entries about selectors */
CREATE TABLE `useless_styles_flags` (
      `selector_hash` varchar(32) NOT NULL,
      `flag` int(1) NOT NULL,
      `add_date` date NOT NULL,
      PRIMARY KEY (`selector_hash`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1
