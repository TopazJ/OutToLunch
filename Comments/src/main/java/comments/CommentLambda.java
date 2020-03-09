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
	@Override
	public String handleRequest(Comment request, Context context) 
	{			
		return "Lambda received the following comment: " + request.toString();
		
		//TODO implement the actual DB solution
	}
}
