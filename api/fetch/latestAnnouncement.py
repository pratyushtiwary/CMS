from utils.msg import error,success
from models.announcement import Announcement

def latestAnnouncement():
	announcement = Announcement()
	latest = announcement.fetchLatest()
	if latest:
		return success(latest)
	else:
		return error("NO_ANNOUNCEMENT_FOUND")