const Profile = function(props) {
  return <h1>{props.fullName}</h1>
}

Profile.getInitialProps = async ({ query }) => {
  console.log('ID', query.id)
  return {
    fullName: 'Author Name',
  }
}

export default Profile
