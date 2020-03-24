/**
 * 
 */
package comments;

import java.sql.Timestamp;

import com.fasterxml.jackson.annotation.JsonProperty;

/**
 * Comment class
 * In posts, logged in users can add comments. Furthermore, all users can see the comments. 
 * Comments can include text, images.
 * 
 * @author Jake Liu
 * @date 2020-02-19
 */
public class Comment 
{
	//Primary key: comment id.
	@JsonProperty("commentID")
	private String commentID;

	//String ID of the user that made the comment
	@JsonProperty("userID")
	private String userID;
	
	//id of the parent to this comment
	//if the comment has no parent, parentID = ""
	@JsonProperty("parentID")
	private String parentID;
	
	//textual content of the comment
	@JsonProperty("content")
	private String content;
	
	@JsonProperty("dateMs")
	//(String) milliseconds since 1970-01-01 of the date
	private long dateMs;
	
	//The (local) date that the comment was made. Format: yyyy-mm-dd-hh:mm:ss
	private Timestamp date;
	
	//getters and setters
	public String getCommentID() {
		return commentID;
	}

	public void setCommentID(String commentID) {
		this.commentID = commentID;
	}

	public String getUserID() {
		return userID;
	}

	public void setUserID(String userID) {
		this.userID = userID;
	}

	public String getParentID() {
		return parentID;
	}

	public void setParentID(String parentID) {
		this.parentID = parentID;
	}

	public String getContent() {
		return content;
	}

	public void setContent(String content) {
		this.content = content;
	}

	public Timestamp getDate() {
		return date;
	}

	public long getDateMs()
	{
		return dateMs;
	}
	
	public void setDate(Timestamp date) {
		this.date = date;
	}
	
	//setter for dateMs, also sets date automatically
	public void setDateMs(long dateMs) {
		this.dateMs = dateMs;
		this.date = new Timestamp(dateMs);
	}
	
	//get JSON representation of 
	public String toJSON()
	{
		String strJSON = "{ \"commentID\": \"" + getCommentID() + "\", ";
		strJSON += "\"userID\": \"" + getUserID() + "\", ";
		strJSON += "\"parentID\": \"" + getParentID() + "\", ";
		strJSON += "\"content\": \"" + getContent() + "\", ";
		strJSON += "\"date\": " + date.toString() + " }";
		return strJSON;
	}
	
	/**
	 * toString() of the comment
	 */
	public String toString()
	{
		String commentStr = "commentID: " + commentID;
		commentStr += ", userID: " + userID;
		commentStr += ", parentID: " + parentID;
		commentStr += ", date: " + date.toString();		
		commentStr += ", content: " + content;
		
		return commentStr;
	}
	
	//constructor with java.sql.Date for JSON
	//will use the class getters and setters, or default if not available
	Comment(String commentID, String userID, String parentID, String content, long dateMs)
	{
	}
	
	//constructor with local date
	Comment(String commentID, String userID, String parentID, String content, Timestamp date)
	{
		this.commentID = commentID;
		this.userID = userID;
		this.parentID = parentID;
		this.content = content;
		this.dateMs = date.getTime();
		this.date = date;
	}
	
	//default constructor
	Comment()
	{
		commentID = "Missing commentID";
		userID = "Missing userID";
		parentID = "Missing parentID";
		content = "Missing content";
		dateMs = 0;
		date = new Timestamp(0);
	}
}
