DELIMITER $$

CREATE EVENT `endBets`
    ON SCHEDULE EVERY 30 MINUTE
    STARTS '2018-05-11 20:30:05'
    DO BEGIN
      UPDATE `greatwhitebuffalo`.`Bets` 
      SET status = IF(end_at < NOW(), 'ended', status)
      WHERE status = 'pending';
	END $$
    
DELIMITER ;