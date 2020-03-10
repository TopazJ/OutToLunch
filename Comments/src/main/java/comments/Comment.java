/**
 * 
 */
package comments;

import java.sql.Date;
import java.time.LocalDate;

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
	
	//String id of the post this comment was made on
	@JsonProperty("postID")
	private String postID;
	
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
	private LocalDate date;
	
	//getters and setters
	public String getCommentID() {
		return commentID;
	}

	public void setCommentID(String commentID) {
		this.commentID = commentID;
	}

	public String getPostID() {
		return postID;
	}

	public void setPostID(String postID) {
		this.postID = postID;
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

	public LocalDate getDate() {
		return date;
	}

	public void setDate(LocalDate date) {
		this.date = date;
	}
	
	//setter for dateMs, also sets date automatically
	public void setDateMs(long dateMs) {
		this.dateMs = dateMs;
		this.date = new Date(dateMs).toLocalDate();
	}
	
	/**
	 * toString() of the comment
	 */
	public String toString()
	{
		String commentStr = "commentID: " + commentID;
		commentStr += ", postID: " + postID;
		commentStr += ", userID: " + userID;
		commentStr += ", parentID: " + parentID;
		commentStr += ", date: " + date.toString();		
		commentStr += ", content: " + content;
		
		return commentStr;
	}
	
	//constructor with java.sql.Date for JSON
	//will use the class getters and setters, or default if not available
	Comment(String commentID, String postID, String userID, String parentID, String content, long dateMs)
	{
	}
	
	//constructor with local date
	Comment(String commentID, String postID, String userID, String parentID, String content, LocalDate date)
	{
		this.commentID = commentID;
		this.postID = postID;
		this.userID = userID;
		this.parentID = parentID;
		this.content = content;
		this.date = date;
	}
	
	//default constructor
	Comment()
	{
		commentID = "Missing commentID";
		postID = "Missing postID";
		userID = "Missing userID";
		parentID = "Missing parentID";
		content = "Missing content";
		dateMs = 0;
		date = LocalDate.of(1970, 1, 1);
	}
}
