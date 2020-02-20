/**
 * 
 */
package comments;

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
	//id of the post this comment was made on
	int postID;
	
	//id of the user that made the comment
	int userID;
	
	//id of the parent to this comment
	//if the comment has no parent, parentID = 0
	int parentID;
	
	//textual content of the comment
	String content;
	
	//The date that the comment was made (GMT). Format: yyyy-mm-dd-hh-mm
	String date;
	
	//constructor
	Comment(int postID, int userID, int parentID, String content, String date)
	{
		this.postID = postID;
		this.userID = userID;
		this.parentID = parentID;
		this.content = content;
		this.date = date;
	}
	
	/**
	 * @param args
	 */
	public static void main(String[] args) {
		// TODO Auto-generated method stub

	}

}
