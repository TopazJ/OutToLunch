package comments;

import com.amazonaws.services.lambda.runtime.Context;
import com.amazonaws.services.lambda.runtime.RequestHandler;

/**
 * Lambda used to make queries of the comment database
 * Based on https://www.youtube.com/watch?v=64dnqaixT3w&list=WL&index=3&t=4s
 * 
 * @author Jake Liu
 * @since 2020-02-25
 */
public class CommentLambda implements RequestHandler<Comment, String>
{
	//Echo given comment
	@Override
	public String handleRequest(Comment request, Context context) 
	{			
		return "Lambda received the following comment: " + request.toString();
	}
	
	//Write comments into the DB
	public String insertRequest(Comment request, Context context) 
	{	
		
		String logStr = "CommentLambda.insertRequest received.\n";
		logStr += "Comment: " + request.toString() + "\n";
		
		//connect to the database
		CommentDBManager dbManager = new CommentDBManager();
		dbManager.readDBCredentials("src/main/java/comments/config.ini");
		dbManager.initDBConnection();
		logStr += "Connected to DB successfully\n";		
		
		//insert comment
		dbManager.insertCommentRow(request);
		logStr += "Comment inserted to DB successfully\n";		
		
		//close
		dbManager.closeDBConnection();		
		
		//report success
		return logStr;
	}
}
