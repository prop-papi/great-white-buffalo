DELIMITER $$

CREATE EVENT `archiveExpiredBets`
    ON SCHEDULE EVERY 30 MINUTE
    STARTS '2018-05-11 19:30:01'
    DO BEGIN
      UPDATE `greatwhitebuffalo`.`Bets` 
      SET status = IF(expires < NOW(), 'expired', status)
      WHERE status = 'pending' AND ISNULL(challenger);
	END $$
    
DELIMITER ;