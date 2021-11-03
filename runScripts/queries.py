tableCreationQueries = """
-- Table structure for table `admin`

CREATE TABLE `admin` (
  `id` int(11) NOT NULL,
  `name` text NOT NULL,
  `email` varchar(216) NOT NULL UNIQUE,
  `password` text NOT NULL,
  `phone` bigint(10) NOT NULL,
  `ts` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `notify` tinyint(1) NOT NULL DEFAULT '1',
  `adminid` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- Table structure for table `announcement`

CREATE TABLE `announcement` (
  `id` int(11) NOT NULL,
  `byAdmin` int(11) DEFAULT NULL,
  `body` text,
  `ts` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- Table structure for table `complaint`

CREATE TABLE `complaint` (
  `id` int(11) NOT NULL,
  `eid` int(11) DEFAULT NULL,
  `vid` int(11) DEFAULT NULL,
  `shortBody` varchar(50) NOT NULL,
  `body` text,
  `ts` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `priority` varchar(4) DEFAULT NULL,
  `status` varchar(8) DEFAULT NULL,
  `msg` text,
  `adminMsg` text,
  `dept` int(11) DEFAULT NULL,
  `repostFrom` int(11) DEFAULT NULL,
  `repostCount` int(11) DEFAULT '0',
  `allotmentDate` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- Table structure for table `department`

CREATE TABLE `department` (
  `id` int(11) NOT NULL,
  `name` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- Table structure for table `employee`

CREATE TABLE `employee` (
  `id` int(11) NOT NULL,
  `name` text NOT NULL,
  `email` varchar(216) NOT NULL UNIQUE,
  `phone` bigint(10) NOT NULL,
  `roomNo` text NOT NULL,
  `accomodation` varchar(8) NOT NULL DEFAULT 'bachelor',
  `password` text NOT NULL,
  `empid` text NOT NULL,
  `ts` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `notify` tinyint(1) NOT NULL DEFAULT '1',
  `active` tinyint(1) DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- Table structure for table `feedback`

CREATE TABLE `feedback` (
  `id` int(11) NOT NULL,
  `forComplaint` int(11) DEFAULT NULL,
  `vendorMsg` longtext,
  `vendorStar` int(11) DEFAULT NULL,
  `employeeMsg` longtext,
  `employeeStar` int(11) DEFAULT NULL,
  `vendorOn` timestamp NULL DEFAULT NULL,
  `employeeOn` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- Table structure for table `image`

CREATE TABLE `image` (
  `id` int(11) NOT NULL,
  `cid` int(11) DEFAULT NULL,
  `path` text
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- Table structure for table `otp`

CREATE TABLE `otp` (
  `id` int(10) NOT NULL,
  `ts` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `code` text NOT NULL,
  `phone` bigint(10) NOT NULL,
  `email` varchar(216) NOT NULL UNIQUE,
  `type` varchar(9) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- Table structure for table `vendor`

CREATE TABLE `vendor` (
  `id` int(11) NOT NULL,
  `name` text NOT NULL,
  `phone` bigint(10) NOT NULL,
  `dept` int(11) DEFAULT NULL,
  `email` varchar(216) NOT NULL UNIQUE,
  `password` text NOT NULL,
  `vendorid` text NOT NULL,
  `ts` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `notify` tinyint(1) NOT NULL DEFAULT '1',
  `active` tinyint(1) DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- Indexes for dumped tables

-- Indexes for table `admin`
ALTER TABLE `admin`
  ADD PRIMARY KEY (`id`);

-- Indexes for table `announcement`
ALTER TABLE `announcement`
  ADD PRIMARY KEY (`id`),
  ADD KEY `byAdmin` (`byAdmin`);

-- Indexes for table `complaint`
ALTER TABLE `complaint`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk1` (`eid`),
  ADD KEY `fk2` (`vid`),
  ADD KEY `fk4` (`dept`),
  ADD KEY `repostFrom` (`repostFrom`);

-- Indexes for table `department`
ALTER TABLE `department`
  ADD PRIMARY KEY (`id`);

-- Indexes for table `employee`
ALTER TABLE `employee`
  ADD PRIMARY KEY (`id`);

-- Indexes for table `feedback`
ALTER TABLE `feedback`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk7` (`forComplaint`);

-- Indexes for table `image`
ALTER TABLE `image`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk3` (`cid`);

-- Indexes for table `otp`
ALTER TABLE `otp`
  ADD PRIMARY KEY (`id`);

-- Indexes for table `vendor`
ALTER TABLE `vendor`
  ADD PRIMARY KEY (`id`);

-- AUTO_INCREMENT for dumped tables

-- AUTO_INCREMENT for table `admin`
ALTER TABLE `admin`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

-- AUTO_INCREMENT for table `announcement`
ALTER TABLE `announcement`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

-- AUTO_INCREMENT for table `complaint`
ALTER TABLE `complaint`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

-- AUTO_INCREMENT for table `department`
ALTER TABLE `department`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

-- AUTO_INCREMENT for table `employee`
ALTER TABLE `employee`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

-- AUTO_INCREMENT for table `feedback`
ALTER TABLE `feedback`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

-- AUTO_INCREMENT for table `image`
ALTER TABLE `image`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

-- AUTO_INCREMENT for table `otp`
ALTER TABLE `otp`
  MODIFY `id` int(10) NOT NULL AUTO_INCREMENT;

-- AUTO_INCREMENT for table `vendor`
ALTER TABLE `vendor`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

-- Constraints for dumped tables

-- Constraints for table `announcement`
ALTER TABLE `announcement`
  ADD CONSTRAINT `announcement_ibfk_1` FOREIGN KEY (`byAdmin`) REFERENCES `admin` (`id`);

-- Constraints for table `complaint`
ALTER TABLE `complaint`
  ADD CONSTRAINT `complaint_ibfk_1` FOREIGN KEY (`repostFrom`) REFERENCES `complaint` (`id`),
  ADD CONSTRAINT `fk1` FOREIGN KEY (`eid`) REFERENCES `employee` (`id`),
  ADD CONSTRAINT `fk2` FOREIGN KEY (`vid`) REFERENCES `vendor` (`id`),
  ADD CONSTRAINT `fk4` FOREIGN KEY (`dept`) REFERENCES `department` (`id`);

-- Constraints for table `feedback`
ALTER TABLE `feedback`
  ADD CONSTRAINT `fk7` FOREIGN KEY (`forComplaint`) REFERENCES `complaint` (`id`);

-- Constraints for table `image`
ALTER TABLE `image`
  ADD CONSTRAINT `fk3` FOREIGN KEY (`cid`) REFERENCES `complaint` (`id`);
COMMIT;

"""